//get list of members in community
import { Community } from "./../../models/Community";
import { BadRequestError } from "@devion/common";
import express, { Request, Response } from "express";
import { Post } from "../../models/Post";
const router = express.Router();

router.get("/api/community/users/:name", async (req: any, res: Response) => {
  try {
    const { name } = req.params; //name of community
    const { limit = 20, skip = 0 } = req.query;
    const community = await Community.findOne({ name });
    if (!community) {
      throw new BadRequestError("Community not found, invalid name provided!");
    }
    const communityMembers = community.members.slice(skip, limit + skip);
    const totalCommunityMembers = community.members.length;
    res.status(201).send({
      message: "Community Members",
      communityMembers,
      totalCommunityMembers,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err });
  }
});

export { router as getCommunityUsersRouter };
