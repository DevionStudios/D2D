import express, { Request, Response } from "express";
import cloudinary from "../../config/cloudinaryConfig";
import upload from "../../config/multer.filefilter.config";

import { BadRequestError } from "@devion/common";
import { currentUser } from "../../middlewares/currentuser";
import { User } from "../../models/User";

const router = express.Router();

router.put(
  "/api/users/imageupdate",
  currentUser,
  async (req: any, res: Response) => {
    try {
      const { image } = req.body;
      const existingUser = await User.findOne({
        email: req.currentUser!.email,
      });

      if (!existingUser) {
        throw new BadRequestError("User not found");
      }
      existingUser.image = image || existingUser.image;
      await existingUser.save();

      res.status(200).send(existingUser);
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: err });
    }
  }
);

export { router as updateProfileImageRouter };
