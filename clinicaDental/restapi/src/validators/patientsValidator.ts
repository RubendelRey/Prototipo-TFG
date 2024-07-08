const { check } = require("express-validator");
const userRepository = require("../repositories/usersRepository");

exports.validatePatient = [
  check("name")
    .isString()
    .isLength({ min: 3, max: 50 })
    .withMessage("Name must be between 3 and 50 characters"),
  check("surname")
    .isString()
    .isLength({ min: 3, max: 50 })
    .withMessage("Surname must be between 3 and 50 characters"),
  check("email").isEmail().withMessage("Invalid email"),
  check("phone")
    .isString()
    .isLength({ min: 9, max: 9 })
    .withMessage("Phone must be 9 characters"),
  check("address")
    .isString()
    .isLength({ min: 3, max: 50 })
    .withMessage("Address must be between 3 and 50 characters"),
  check("birthdate").isString().withMessage("Birthdate must be a string"),
];
