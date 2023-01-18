import jwt from "jsonwebtoken";
import { BadRequestError } from "@devion/common";
import express, { Request, Response } from "express";

import { User } from "../../models/User";
import { Password } from "../../services/password";

import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.post("/api/users/signin", async (req: Request, res: Response) => {
  try {
    const { GMAIL, password, accountWallet } = req.body;

    let existingUser: any;
    if (GMAIL && GMAIL.length > 0) existingUser = await User.findOne({ GMAIL });
    else existingUser = await User.findOne({ accountWallet });

    if (!existingUser) {
      throw new Error("User does not exist!");
    }

    if (existingUser.password) {
      const passwordsMatch = await Password.compare(
        existingUser.password!,
        password
      );
      if (!passwordsMatch) {
        throw new BadRequestError("Invalid Credentials");
      }
    }

    // Generate JWT
    let userJwt;
    if (GMAIL && GMAIL.length > 0)
      userJwt = jwt.sign(
        {
          GMAIL: existingUser.GMAIL,
          username: existingUser.username,
          id: existingUser.id,
        },
        process.env.JWT_KEY!
      );
    else
      userJwt = jwt.sign(
        {
          accountWallet: existingUser.accountWallet,
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
    res.status(400).send({ message: err });
  }
});

export { router as signinRouter };
