import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";

import { Password } from "../../services/password";
import { User } from "../../models/User";
import { validateRequest, BadRequestError } from "@devion/common";

import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 30 })
      .withMessage("You must supply a password between 4 and 30 characters"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const existingUser = await User.findOne({ email });

      if (!existingUser) {
        throw new Error("User does not exist!");
      }

      const passwordsMatch = await Password.compare(
        existingUser.password!,
        password
      );
      if (!passwordsMatch) {
        throw new BadRequestError("Invalid Credentials");
      }

      // Generate JWT
      const userJwt = jwt.sign(
        {
          email: existingUser.email,
          username: existingUser.username,
          id: existingUser.id,
        },
        process.env.JWT_KEY!
      );

      // Store it on session object
      req.session = {
        jwt: userJwt,
      };

      res.status(200).send({
        jwt: userJwt,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: err });
    }
  }
);

export { router as signinRouter };
