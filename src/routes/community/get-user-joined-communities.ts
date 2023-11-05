//discover page
//get all communities
import { Community } from "./../../models/Community";
import { BadRequestError } from "@devion/common";
//get community sorted by trending or new
import express, { Request, Response } from "express";
import { currentUser } from "../../middlewares/currentuser";
import mongoose from "mongoose";
const router = express.Router();

router.get(
  "/api/community/joined",
  currentUser,
  async (req: any, res: Response) => {
    try {
      const { limit = 20, skip = 0 } = req.query;
      const communities = await Community.find({
        "members.userId": new mongoose.Types.ObjectId(req.foxxiUser!.id),
      })
        .skip(Number(skip))
        .limit(Number(limit))
        .sort({ createdAt: -1 });
      const totalCommunities = await Community.find({
        "members.userId": new mongoose.Types.ObjectId(req.foxxiUser!.id),
      }).countDocuments();
      res.status(200).send({
        message: "Communities",
        communities,
        totalCommunities,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: err });
    }
  }
);

export { router as getJoinedCommunitiesRouter };
