import express from "express";
import { User } from "../../models/User";
import { currentUser } from "../../middlewares/currentuser";
const router = express.Router();

router.get("/api/users/currentuser", currentUser, async (req, res) => {
  const { currentUser } = req;
  if (currentUser) {
    const { email } = currentUser!;
    const user = await User.findOne({ email: email });
    res.json({ currentUser: user });
  } else res.json({ currentUser: undefined });
});

export { router as currentUserRouter };
