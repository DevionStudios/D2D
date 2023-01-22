import express, { Request, Response } from "express";

import { Post } from "../../models/Post";
import { User, UserDoc } from "../../models/User";
import { currentAdmin } from "../../middlewares/currentadmin";

const router = express.Router();

router.post(
  "/api/admin/posts/create",
  currentAdmin,
  async (req: Request, res: Response) => {
    try {
      const { caption } = req.body;

      let existingUser = await User.findOne({
        username: "foxxi",
      });
      let foxxiOfficialUser;

      if (!existingUser) {
        // create foxxi Official user
        foxxiOfficialUser = User.build({
          username: "foxxi",
          email: process.env.GMAIL!,
          password: process.env.GMAIL_PASSWORD!,
          name: "Foxxi Official",
          bio: "Foxxi Official Account",
        });

        await foxxiOfficialUser.save();
      }

      const post = Post.build({
        caption,
        author: existingUser || (foxxiOfficialUser as UserDoc),
      });
      existingUser?.posts!.push(post);
      foxxiOfficialUser?.posts!.push(post);

      await post.save();
      await existingUser?.save();
      await foxxiOfficialUser?.save();

      res.status(201).send({
        message: "Post created successfully",
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: err });
    }
  }
);

export { router as createOfficialPostRouter };
