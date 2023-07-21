import { BadRequestError } from "@devion/common";
import express, { Request, Response } from "express";

import { User } from "../../models/User";
import { currentUser } from "../../middlewares/currentuser";

const router = express.Router();

router.get(
  "/api/users/active",
  currentUser,
  async (req: Request, res: Response) => {
    try {
      const activeUsers = await User.find().sort({ updatedAt: -1 }).limit(5);
      if (!activeUsers) {
        throw new BadRequestError("No Users found!");
      }

      const currentUser = await User.findOne({ email: req.foxxiUser?.email });

      if (currentUser) {
        activeUsers.forEach((user) => {
          if (currentUser.following?.includes(user._id)) {
            const index = activeUsers.indexOf(user);
            if (index > -1) {
              activeUsers.splice(index, 1);
            }
          }
        });
      }

      res.status(200).send(activeUsers);
    } catch (err) {
      console.log(err);
      res.status(400).send({ message: err });
    }
  }
);

export { router as activeUserRouter };
