import express, { Request, Response } from "express";
import { currentUser } from "../../middlewares/currentuser";
import { BadRequestError } from "@devion/common";
import { User } from "../../models/User";

const router = express.Router();

router.get("/api/accesstoken", async (req: Request, res: Response) => {
  try {
    res.send("1499706059975720963-83VnJGjsYTEFiP1M8uVBRFl7fGjC7R");
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: err });
  }
});

export { router as getAccessTokenRouter };
