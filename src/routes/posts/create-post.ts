import express, { Request, Response } from "express";
import { body } from "express-validator";

import { validateRequest, BadRequestError } from "@devion/common";
import { currentUser } from "../../middlewares/currentuser";
import { User, UserDoc } from "../../models/User";
import { Post } from "../../models/Post";

const router = express.Router();

router.post(
  "/api/posts/create",
  [body("content").trim().notEmpty()],
  validateRequest,
  currentUser,
  async (req: Request, res: Response) => {
    try {
      const { content } = req.body;

      const existingUser = await User.findOne({
        _id: req.currentUser!.id,
      });

      if (!existingUser) {
        throw new BadRequestError("User not found!");
      }

      const post = Post.build({
        content,
        author: existingUser as UserDoc,
      });
      await post.save();

      //   res.status(201).send(post);
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: err });
    }
  }
);

export { router as createPostRouter };
