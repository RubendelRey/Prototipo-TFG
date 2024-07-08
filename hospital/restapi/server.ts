import express, { Application } from "express";
import bp from "body-parser";
import { readFileSync } from "fs";
import { createServer } from "https";
import expressSession from "express-session";
import { PatientService } from "./src/services/patientService";
import { PatientRepository } from "./src/repositories/patientRepository";
import bodyParser from "body-parser";
import { UserRepository } from "./src/repositories/userRepository";
import { UserService } from "./src/services/userService";
import { DataInitializationService } from "./src/services/dataInitializationService";
import { DoctorRepository } from "./src/repositories/doctorRepository";
import { DoctorService } from "./src/services/doctorService";
import cors from "cors";
import { TreatmentRepository } from "./src/repositories/treatmentRepository";
import { TreatmentTypeRepository } from "./src/repositories/treatmentTypeRepository";
import { TreatmentService } from "./src/services/treatmentService";
import { TreatmentTypeService } from "./src/services/treatmentTypeService";
import { MeetingRepository } from "./src/repositories/meetingRepository";
import { MeetingService } from "./src/services/meetingService";
import { SolidService } from "./src/services/solidService";
import { RequestRepository } from "./src/repositories/requestRepository";

const app: Application = express();
const port: number = parseInt(process.env.RESTAPI_PORT || "6444");

const hostName: string = process.env.DOMAIN || "localhost";
const hostIp = process.env.IP || "127.0.0.1";
const secret = process.env.SECRET || "abcdfg";
const mongoConnection =
  process.env.MONGO_CONNETION_STRING ||
  "mongodb://admin:password@localhost:6445";

app.use(
  cors({
    credentials: true,
    origin: ["https://" + hostName + ":6443", "https://" + hostIp + ":6443"],
    allowedHeaders: ["Content-Type", "Authorization"],
    preflightContinue: true,
  })
);

app.all("*", function (req: any, res: any, next: any) {
  if (req.secure) {
    return next();
  }
  res.redirect("https://" + hostName + ":" + port + req.url);
});

app.use(
  expressSession({
    secret: secret,
    resave: true,
    saveUninitialized: true,
  })
);

let crypto = require("crypto");
app.set("password", secret);
app.set("crypto", crypto);

let privateKey = readFileSync("certificates/host.key");
let certificate = readFileSync("certificates/host.cert");
let credentials = { key: privateKey, cert: certificate };

try {
  privateKey = readFileSync("certificates/privkey.pem");
  certificate = readFileSync("certificates/fullchain.pem");
  credentials = { key: privateKey, cert: certificate };
} catch (e) {}

app.use(bp.json());
const api = express.Router();

api.use(bodyParser.json());
app.use("/api", api);

const { MongoClient } = require("mongodb");
let mongoClient = new MongoClient(mongoConnection);

const patientRepository: PatientRepository = new PatientRepository(mongoClient);
const userRepository: UserRepository = new UserRepository(mongoClient);
const doctorRepository: DoctorRepository = new DoctorRepository(mongoClient);
const treatmentRepository: TreatmentRepository = new TreatmentRepository(
  mongoClient
);
const treatmentTypeRepository: TreatmentTypeRepository =
  new TreatmentTypeRepository(mongoClient);
const meetingRepository = new MeetingRepository(mongoClient);
const requestRepository = new RequestRepository(mongoClient);

const patientService: PatientService = new PatientService(
  patientRepository,
  userRepository
);
const userService = new UserService(userRepository);
const doctorService = new DoctorService(doctorRepository, userRepository);
const treatmentService = new TreatmentService(
  treatmentRepository,
  patientRepository,
  doctorRepository,
  treatmentTypeRepository
);
const treatmentTypeService = new TreatmentTypeService(treatmentTypeRepository);
const appoinmentService = new MeetingService(
  meetingRepository,
  doctorRepository,
  patientRepository
);
const solidService = new SolidService(
  patientService,
  treatmentService,
  requestRepository
);

const roleRouter = require("./src/routers/roleRouter");

api.use("/meeting", roleRouter(userRepository, "doctor"));
api.use("/meetings/doctor", roleRouter(userRepository, "doctor"));
api.use("/meetings/patient", roleRouter(userRepository, "patient"));

require("./src/controllers/patientController")(api, patientService);
require("./src/controllers/userController")(app, api, userService);
require("./src/controllers/doctorController")(api, doctorService);
require("./src/controllers/treatmentController")(
  api,
  treatmentService,
  patientService
);
require("./src/controllers/treatmentTypeController")(api, treatmentTypeService);
require("./src/controllers/meetingController")(
  api,
  appoinmentService,
  doctorService,
  patientService
);
require("./src/controllers/solidController")(api, solidService);

const initializeDataService: DataInitializationService =
  new DataInitializationService(
    app,
    userRepository,
    patientRepository,
    doctorRepository,
    treatmentRepository,
    treatmentTypeRepository,
    meetingRepository,
    requestRepository
  );
initializeDataService
  .initializeData()
  .then(() => {
    console.log("Data initialized");
  })
  .catch((e: any) => {
    console.error("Error initializing data");
    console.error(e);
    console.error(e.stack);
  });

createServer(credentials, app)
  .listen(port, (): void => {
    console.log("Restapi listening on " + port);
  })
  .on("error", (error: Error) => {
    console.error("Error occured: " + error.message);
  });
