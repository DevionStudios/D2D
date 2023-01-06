import express, { Request, Response } from "express";

import { BadRequestError, validateRequest } from "@devion/common";
import { currentUser } from "../../middlewares/currentuser";
import { User, UserDoc } from "../../models/User";
import { Post } from "../../models/Post";
import mongoose from "mongoose";
import { body } from "express-validator";

const router = express.Router();

router.put(
  "/api/like",
  // [
  //   body("id")
  //     .not()
  //     .isEmpty()
  //     .matches(/^[0-9a-fA-F]{24}$/)
  //     .withMessage("Post Id is not valid"),
  // ],
  // validateRequest,
  currentUser,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.body;
      console.log("id: ", id);
      const post = await Post.findOne({
        _id: new mongoose.Types.ObjectId(id),
      }).populate("author");

      if (!post) {
        throw new BadRequestError("Post not found");
      }

      const existingUser = await User.findOne({ _id: req.foxxiUser!.id });

      if (!existingUser) {
        throw new BadRequestError("User not found!");
      }

      if (post.author.id === existingUser.id) {
        throw new BadRequestError("You cannot like your own post");
      }

      console.log("post: ", post);

      if (!post.likes) {
        post.likes = [];
        post.likes.push(existingUser);
      } else {
        const existingLike = post.likes.find(
          (like) => like.toString() === existingUser.id.toString()
        );

        console.log("existingLike: ", existingLike);

        if (existingLike) {
          post.likes = post.likes.filter(
            (like) => like.toString() !== existingUser.id.toString()
          );
        } else {
          post.likes.push(existingUser);
        }
      }

      await post.save();

      res.send(post);
    } catch (err: any) {
      console.log(err);
      res.status(400).send({
        message: err?.message!,
      });
    }
  }
);

export { router as LikePostRouter };
