import express, { Request, Response } from "express";
import { Verification } from "../../models/Verification";
import { currentUser } from "../../middlewares/currentuser";
import * as nodemailer from "nodemailer";
import { Password } from "../../services/password";

const router = express.Router();

router.post(
  "/api/verification/generate",
  currentUser,
  async (req: Request, res: Response) => {
    const { email } = req.currentUser!;
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const hashed = await Password.toHash(code);
    try {
      // check if already exists
      const existingVerification = await Verification.findOne({ email: email });
      if (existingVerification) {
        existingVerification.code = hashed;
        await existingVerification.save();
      } else {
        // create new verification
        const verification = Verification.build({
          email: email,
          code: hashed,
        });
        await verification.save();
      }

      const codeText = `Your verification code is: ${code}. Please Enter this code to verify your account.`;
      const subject = `Verification code from Foxxi`;
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_ADDRESS!,
          pass: process.env.EMAIL_PASSWORD!,
        },
      });

      var mailOptions = {
        from: process.env.EMAIL_ADDRESS!,
        to: email,
        subject: subject,
        text: codeText,
      };

      transporter.sendMail(mailOptions, function (error: any, info: any) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
      res.status(200).send({ message: "Verification code sent!" });
    } catch (e) {
      console.log(e);
      res.status(400).send({ message: e });
    }
  }
);
