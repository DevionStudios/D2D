import express, { Request, Response } from "express";
import { body } from "express-validator";

import { validateRequest, BadRequestError } from "@devion/common";
import { currentUser } from "../../middlewares/currentuser";
import mongoose from "mongoose";
import { User } from "../../models/User";
import { Comment } from "../../models/Comment";

const router = express.Router();

router.post(
  "/api/comments/update",
  currentUser,
  async (req: Request, res: Response) => {
    try {
      const { caption, id } = req.body;

      console.log("Updating caption: ", caption, " for comment id: ", id);

      const comment = await Comment.findOne({
        _id: new mongoose.Types.ObjectId(id),
      });

      if (!comment) {
        throw new BadRequestError("Comment not found!");
      }

      const existingUser = await User.findOne({
        username: req.currentUser!.username,
      });

      if (!existingUser) {
        throw new BadRequestError("User not found!");
      }

      if (existingUser._id.toString() !== comment.author.toString()) {
        throw new BadRequestError(
          "You are not authorized to update this comment!"
        );
      }

      comment.caption = caption || comment.caption;

      await comment.save();

      res.status(201).send("Comment updated successfully!");
    } catch (err) {
      console.log(err);
      res.status(400).send({ message: err });
    }
  }
);

export { router as updateCommentRouter };
