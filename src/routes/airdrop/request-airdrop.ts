import express, { Request, Response } from "express";
import * as nodGMAILer from "nodGMAILer";

const router = express.Router();

router.post("/api/airdrop/request", async (req: Request, res: Response) => {
  const { GMAIL, walletAddress, message } = req.body;

  try {
    const codeText = `${GMAIL} has requested for Foxxi Token Airdrop. Please send 50 Foxxi Tokens to ${walletAddress}. 

Message from ${GMAIL}: 
${message}`;
    const subject = `Foxxi Token Airdrop Request`;
    var transporter = nodGMAILer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.HELPLINE_GMAIL,
        pass: process.env.HELPLINE_GMAIL_PASSWORD,
      },
    });

    var mailOptions = {
      from: process.env.HELPLINE_GMAIL,
      to: process.env.HELPLINE_GMAIL,
      subject: subject,
      text: codeText,
    };

    await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, function (error: any, info: any) {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          console.log("GMAIL sent: " + info.response);
          resolve(info);
        }
      });
    });

    res.status(200).send({
      message: "Airdrop request sent. You will soon receive the foxxi tokens.",
    });
  } catch (e) {
    console.log(e);
    res.status(400).send({ message: e });
  }
});

export { router as airdropRequestRouter };
