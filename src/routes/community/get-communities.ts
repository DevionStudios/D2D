//discover page
//get all communities
import { Community } from "./../../models/Community";
import { BadRequestError } from "@devion/common";
//get community sorted by trending or new
import express, { Request, Response } from "express";
const router = express.Router();

router.get("/api/community/discover", async (req: any, res: Response) => {
  try {
    const { limit = 20, skip = 0 } = req.query;
    const communities = await Community.find({})
      .skip(Number(skip))
      .limit(Number(limit))
      .sort({ createdAt: -1 });
    const totalCommunities = await Community.find({}).countDocuments();
    res.status(201).send({
      message: "Communities",
      communities,
      totalCommunities,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err });
  }
});
