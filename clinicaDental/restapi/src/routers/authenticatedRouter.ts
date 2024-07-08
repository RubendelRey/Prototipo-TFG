import express from "express";
import { UserRepository } from "../repositories/userRepository";

module.exports = function (userRepository: UserRepository) {
  let authenticatedRouter = express.Router();
  authenticatedRouter.use(function (req: any, res: any, next: any) {
    if (!req.session.user) {
      res.status(401).json({ message: "Unauthorized" });
    } else {
      userRepository.findOne({ _id: req.session.user }).then((user) => {
        if (!user) {
          res.status(401).json({ message: "Unauthorized" });
        } else {
          next();
        }
      });
    } 
  });
};
