import jwt from "jsonwebtoken";
import { body } from "express-validator";
import express, { Request, Response } from "express";
import { validateRequest, BadRequestError } from "@devion/common";
import { Verification } from "../../models/Verification";
import { Password } from "../../services/password";
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
      const { GMAIL, password, username, name, accountWallet } = req.body;

      // check if GMAIL is provided
      let existingUser: any;
      if (GMAIL && GMAIL.length > 0)
        existingUser = await User.findOne({ GMAIL });
      else existingUser = await User.findOne({ accountWallet });

      if (existingUser) {
        throw new BadRequestError("Account already in use");
      }

      const userWithSameUsername = await User.findOne({ username });
      if (userWithSameUsername) {
        throw new BadRequestError("Username already in use");
      }
      let user;
      if (GMAIL && GMAIL.length > 0) {
        user = User.build({ GMAIL, password, username, name });
        const existingVerification = await Verification.findOne({
          GMAIL: GMAIL,
        });
        if (!existingVerification) {
          return res.status(400).send({ message: "Verify Yourself First!" });
        }
        const passwordsMatch = await Password.compare(
          existingVerification.code!,
          "verified"
        );
        if (!passwordsMatch) {
          return res.status(400).send({ message: "Verify Yourself First!" });
        }
        const deleteVerification = await Verification.deleteOne({
          GMAIL: GMAIL,
        });
        console.log(deleteVerification);
      } else user = User.build({ username, name, accountWallet });
      await user.save();

      // Generate JWT
      let userJwt;
      if (GMAIL && GMAIL.length > 0)
        userJwt = jwt.sign(
          {
            GMAIL: user.GMAIL,
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
