import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";

import { validateRequest, BadRequestError } from "@devion/common";
import { User } from "../../models/User";

import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
    body("username").trim().notEmpty(),
    body("name").trim().notEmpty(),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { email, password, username, name } = req.body;

      const existingUser = await User.findOne({ email });

      if (existingUser) {
        throw new BadRequestError("Email already in use");
      }

      const userWithSameUsername = await User.findOne({ username });
      if (userWithSameUsername) {
        throw new BadRequestError("Username already in use");
      }

      const user = User.build({ email, password, username, name });
      await user.save();

      // Generate JWT
      const userJwt = jwt.sign(
        {
          id: user.id,
          email: user.email,
        },
        process.env.JWT_KEY!
      );

      // Store it on session object
      req.session = {
        jwt: userJwt,
      };

      res.status(201).send(user);
    } catch (err: any) {
      console.log(err);
      res.status(400).send({ message: err });
    }
  }
);

export { router as signupRouter };
