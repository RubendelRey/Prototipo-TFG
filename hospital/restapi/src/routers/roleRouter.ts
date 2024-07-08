import express from "express";
import { UserRepository } from "../repositories/userRepository";

module.exports = function (userRepository: UserRepository, role: string) {
  const doctorRoute = express.Router();
  doctorRoute.use(function (req: any, res: any, next: any) {
    if (!req.session.user) {
      res.status(401).json({ message: "Unauthorized" });
    } else {
      userRepository
        .findOne({ _id: req.session.user, role: role })
        .then((doctor) => {
          if (!doctor) {
            res.status(401).json({ message: "Unauthorized" });
          } else {
            next();
          }
        });
    }
  });

  return doctorRoute;
};
