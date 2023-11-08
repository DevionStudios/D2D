import { Community } from "../../models/Community";
import { CommunityChannel } from "../../models/CommunityChannel";
import { BadRequestError } from "@devion/common";
import express, { Request, Response } from "express";
import { User } from "../../models/User";
import { currentUser } from "../../middlewares/currentuser";

const router = express.Router();

router.get("/api/community/channels/:name", async (req: any, res: Response) => {
  const { name } = req.params;
  try {
    const communityDoc = await Community.findOne({ name }).populate("channels");
    if (!communityDoc) {
      throw new BadRequestError("Community not found!");
    }
    res.status(200).send(communityDoc.channels);
  } catch (e) {
    console.log(e);
    res.status(500).send({ message: e });
  }
});

export { router as getCommunityChannelsRouter };
