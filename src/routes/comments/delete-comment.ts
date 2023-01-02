import express, { Request, Response } from "express";

import { BadRequestError } from "@devion/common";
import { currentUser } from "../../middlewares/currentuser";
import { Comment } from "../../models/Comment";
import mongoose from "mongoose";
import { User } from "../../models/User";

const router = express.Router();

router.delete(
  "/api/comments/delete/:id",
  currentUser,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

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
          "You are not authorized to delete this comment!"
        );
      }

      await comment.delete();

      res.status(204).send("Comment deleted successfully!");
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: err });
    }
  }
);

export { router as deleteCommentRouter };
