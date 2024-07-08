import { Doctor } from "../model/doctor";
import { DoctorService } from "../services/doctorService";

module.exports = function (api: any, service: DoctorService) {
  api.get("/doctors", async (req: any, res: any) => {
    try {
      let filter = req.query.filter;
      let doctors: Doctor[] = await service.getDoctors(filter);
      res.status(200).json(doctors);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  api.get("/doctors/:id", async (req: any, res: any) => {
    try {
      const doctor: Doctor = await service.getDoctor(req.params.id);
      res.status(200).json(doctor);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  api.post("/doctors", async (req: any, res: any) => {
    try {
      let doctor = new Doctor(
        req.body.name,
        req.body.surname,
        req.body.phone,
        req.body.email,
        req.body.address,
        req.body.birthdate
      );
      let id: string = await service.createDoctor(doctor);
      res.status(201).json(id);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  api.get("/doctor", async (req: any, res: any) => {
    service
      .getDoctorByUserId(req.session.user)
      .then((doctor) => {
        res.status(200).json(doctor);
      })
      .catch((error) => {
        res.status(500).send(error);
      });
  });
};
