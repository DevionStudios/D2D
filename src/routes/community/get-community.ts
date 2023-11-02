//get info about community
import { Community } from "./../../models/Community";
import { BadRequestError } from "@devion/common";
import express, { Request, Response } from "express";
const router = express.Router();

router.get("/api/community/:name", async (req: any, res: Response) => {
  try {
    const { name } = req.params; //name of community
    const community = await Community.findOne({ name }, "-members");
    if (!community) {
      throw new BadRequestError("Community not found, invalid name provided!");
    }
    res.status(200).send({
      message: "Community Information",
      community,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err });
  }
});

export { router as getCommunityRouter };
