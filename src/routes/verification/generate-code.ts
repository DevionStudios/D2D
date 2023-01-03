import express, { Request, Response } from "express";
import { Verification } from "../../models/Verification";
import { currentUser } from "../../middlewares/currentuser";

const router = express.Router();

router.post(
  "/api/verification/generate",
  currentUser,
  (req: Request, res: Response) => {
    const { email } = req.currentUser!;
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const verification = Verification.build({
      email,
      code,
    });
    verification.save();
    
  }
);
