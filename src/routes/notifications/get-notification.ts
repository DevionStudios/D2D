import express, { Request, Response } from "express";

import { Notification } from "../../models/Notification";
import { currentUser } from "../../middlewares/currentuser";

const router = express.Router();

router.get(
  "/api/notification/create",
  currentUser,
  async (req: Request, res: Response) => {
    try {
      const notifications = await Notification.find({
        userId: req.currentUser?.id,
      }).sort({
        createdAt: -1,
      });
      res.status(201).send({ data: notifications });
    } catch (err) {
      console.log(err);
      res.send({ message: err });
    }
  }
);

export { router as getNotificationRouter };
