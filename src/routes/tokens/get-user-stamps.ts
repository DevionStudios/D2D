import express, { Request, Response } from "express";
import axios from "axios";

const router = express.Router();

router.get(
  "/api/token/teststamp/:bitcoinWalletAddress",
  async (req: Request, res: Response) => {
    try {
      const { bitcoinWalletAddress } = req.params;

      // get all the ordinals from https://stampchain.io/api/src20
      const response = await axios.get(`https://stampchain.io/api/src20`);
      const stamps = response.data;

      console.log("Stamps: ", stamps.length);

      // filter the ordinals.items to only include the ones that have the bitcoinWalletAddress in the creator field
      const userStamps = stamps.filter(
        (ordinal: { creator: string }) =>
          ordinal.creator == bitcoinWalletAddress
      );

      res.status(200).send(userStamps);
    } catch (error) {
      console.log(error);
      res.status(400).send({ message: error });
    }
  }
);

export { router as getUserStampsRouter };
