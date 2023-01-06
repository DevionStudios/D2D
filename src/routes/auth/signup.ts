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
    body("username")
      .trim()
      .isLength({ min: 3, max: 20 })
      .withMessage("Username must be between 3 and 20 characters"),
    body("name").trim().notEmpty().withMessage("Name is required"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { email, password, username, name, accountWallet } = req.body;

      // check if email is provided
      let existingUser: any;
      if (email && email.length > 0)
        existingUser = await User.findOne({ email });
      else existingUser = await User.findOne({ accountWallet });

      if (existingUser) {
        throw new BadRequestError("Account already in use");
      }

      const userWithSameUsername = await User.findOne({ username });
      if (userWithSameUsername) {
        throw new BadRequestError("Username already in use");
      }
      let user;
      if (email && email.length > 0)
        user = User.build({ email, password, username, name });
      else user = User.build({ username, name, accountWallet });
      await user.save();

      // Generate JWT
      let userJwt;
      if (email && email.length > 0)
        userJwt = jwt.sign(
          {
            email: user.email,
            username: user.username,
            id: user.id,
          },
          process.env.JWT_KEY!
        );
      else
        userJwt = jwt.sign(
          {
            accountWallet: user.accountWallet,
            username: user.username,
            id: user.id,
          },
          process.env.JWT_KEY!
        );

      // Store it on session object
      req.session = {
        jwt: userJwt,
      };

      res.status(201).send({
        jwt: userJwt,
      });
    } catch (err: any) {
      console.log(err);
      res.status(400).send({ message: err });
    }
  }
);

export { router as signupRouter };
