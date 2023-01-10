import express from "express";
import { User } from "../../models/User";

import { currentUser } from "../../middlewares/currentuser";

const router = express.Router();

router.get("/api/users/currentuser", currentUser, async (req, res) => {
  const { foxxiUser } = req;
  if (foxxiUser) {
    const email = foxxiUser.email;
    const accountWallet = foxxiUser.accountWallet;
    let user;
    if (email) user = await User.findOne({ email: email });
    else if (accountWallet)
      user = await User.findOne({ accountWallet: accountWallet });

    if (user?.isBanned)
      return res.status(403).json({
        message: "You are temporarily banned from Foxxi",
        currentUser: undefined,
      });

    res.json({ currentUser: user });
  } else res.json({ currentUser: undefined });
});

export { router as currentUserRouter };
