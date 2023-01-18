import jwt from "jsonwebtoken";
import { body } from "express-validator";
import express, { Request, Response } from "express";
import { validateRequest, BadRequestError } from "@devion/common";

import { Admin } from "../../models/Admin";

import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.post(
  "/api/admin/signup",
  [
    body("username")
      .trim()
      .isLength({ min: 3, max: 20 })
      .withMessage("Username must be between 3 and 20 characters"),
    body("password").trim().notEmpty().withMessage("Password is required"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { GMAIL, password, username } = req.body;

      // check if GMAIL is provided
      const existingAdmin = await Admin.findOne({ GMAIL: GMAIL });

      if (existingAdmin) {
        throw new BadRequestError("User already signed up");
      }

      const AdminWithSameAdminname = await Admin.findOne({
        username: username,
      });
      if (AdminWithSameAdminname) {
        throw new BadRequestError("Username already in use");
      }

      const admin = Admin.build({ GMAIL, password, username });
      await admin.save();

      // Generate JWT
      const AdminJwt = jwt.sign(
        {
          GMAIL: admin.GMAIL,
          Adminname: admin.username,
          id: admin.id,
        },
        process.env.JWT_KEY!
      );

      // Store it on session object
      req.session = {
        jwt: AdminJwt,
      };

      res.status(201).send({
        jwt: AdminJwt,
      });
    } catch (err: any) {
      console.log(err);
      res.status(400).send({ message: err });
    }
  }
);

export { router as adminSignupRouter };
