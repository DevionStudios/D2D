import express, { Request, Response } from "express";
import axios from "axios";

const router = express.Router();

router.get("/api/token/stamp/:address", async (req: Request, res: Response) => {
  try {
    const { address } = req.params;

    // get all the ordinals from https://stampchain.io/api/src20
    const response = await axios.get(`https://stampchain.io/api/src20`);
    const ordinals = response.data;

    // filter the ordinals.items to only include the ones that have the address in the creator field
    const userOrdinals = ordinals.items.filter(
      (ordinal: { creator: string }) => ordinal.creator === address
    );

    res.status(200).send(userOrdinals);
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: error });
  }
});

export { router as getUserStampsRouter };
