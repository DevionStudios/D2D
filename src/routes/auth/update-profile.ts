import express, { Request, Response } from "express";

import cloudinary from "../../config/cloudinaryConfig";
import upload from "../../config/multer.filefilter.config";

import { BadRequestError } from "@devion/common";
import { currentUser } from "../../middlewares/currentuser";
import { User } from "../../models/User";

const router = express.Router();

router.put(
  "/api/users/update",
  currentUser,
  upload.array("images", 5),
  async (req: Request, res: Response) => {
    console.log("Raw files:", req.files);
    try {
      const { username, name, bio, walletAddress } = req.body;
      var imageUrlList: any[] = [];
      const existingUser = await User.findOne({
        email: req.currentUser!.email,
      });

      if (!existingUser) {
        throw new BadRequestError("User not found");
      }
      // Upload image to cloudinary and create url
      if (req.files) {
        const files = req.files as Express.Multer.File[];
        console.log("files", files);
        for (var i = 0; i < files.length; i++) {
          var locaFilePath = files[i].path;

          // Upload the local image to Cloudinary
          // and get image url as response
          var result = await cloudinary.uploader.upload(locaFilePath);
          imageUrlList.push(result.secure_url);
        }
      }
      console.log("imageUrl:", imageUrlList);
      // Update user details if they are different, otherwise fallback to existing values
      existingUser.username = username || existingUser.username;
      existingUser.name = name || existingUser.name;
      existingUser.bio = bio || existingUser.bio;
      existingUser.image = imageUrlList[0] || existingUser.image;
      existingUser.coverImage = imageUrlList[1] || existingUser.coverImage;
      existingUser.walletAddress = walletAddress || existingUser.walletAddress;

      if (!existingUser.twitterUsername) {
        existingUser.twitterUsername = req.body.twitterUsername;
      }

      await existingUser.save();

      res.status(200).send(existingUser);
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: err });
    }
  }
);

export { router as updateProfileRouter };
