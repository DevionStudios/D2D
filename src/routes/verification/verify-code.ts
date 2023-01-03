import express, { Request, Response } from "express";
import { Verification } from "../../models/Verification";
import { currentUser } from "../../middlewares/currentuser";
import { Password } from "../../services/password";
import { BadRequestError } from "@devion/common";

const router = express.Router();

router.post(
  "/api/verification/compare",
  currentUser,
  async (req: Request, res: Response) => {
    const { code } = req.body;

    const existingVerification = await Verification.findOne({
      email: req.currentUser!.email,
    });
    if (!existingVerification) {
      throw new BadRequestError("Email not found");
    }
    const passwordsMatch = await Password.compare(
      existingVerification.code!,
      code
    );

    if (!passwordsMatch) {
      throw new BadRequestError("Invalid Code Given");
    }

    const deletedVerification = await Verification.deleteOne({
      email: req.currentUser!.email,
    });

    console.log(deletedVerification);
    res.status(200).send({ message: "verified" });
  }
);
