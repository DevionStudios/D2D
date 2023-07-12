import express, { Request, Response } from "express";
import axios from "axios";

const router = express.Router();

router.get(
  "/api/token/teststamp/:bitcoinWalletAddress",
  async (req: Request, res: Response) => {
    try {
      const { bitcoinWalletAddress } = req.params;

      // get all the ordinals from https://stampchain.io/api/src20
      const response = await axios.get(
        `https://stampchain.io/api/src20?creator=${bitcoinWalletAddress}`
      );
      const stamps = response.data;

      res.status(200).send(stamps);
    } catch (error) {
      console.log(error);
      res.status(400).send({ message: error });
    }
  }
);

export { router as getUserStampsRouter };
