import express, { Request, Response } from "express";
import { currentUser } from "../../middlewares/currentuser";
import { BadRequestError } from "@devion/common";
import { User } from "../../models/User";

const router = express.Router();

router.get(
  "/api/users/search/:searchWord",
  currentUser,
  async (req: Request, res: Response) => {
    console.log(req.params.searchWord!);
    const searchWord = req.params.searchWord;
    try {
      const existingUser = await User.find({
        $or: [
          { username: { $regex: searchWord, $options: "i" } },
          { name: { $regex: searchWord, $options: "i" } },
        ],
      });
      if (!existingUser) {
        throw new BadRequestError("No Users found!");
      }
      console.log(existingUser);
      res.status(200).send(existingUser);
    } catch (err) {
      console.log(err);
      res.status(400).send({ message: err });
    }
  }
);

export { router as searchUserRouter };
