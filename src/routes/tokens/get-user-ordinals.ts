import express, { Request, Response } from "express";
import axios from "axios";

const router = express.Router();

router.get(
  "/api/token/testordinal/:bitcoinWallet",
  async (req: Request, res: Response) => {
    try {
      const { bitcoinWallet } = req.params;

      // get all the ordinals from https://api.hiro.so/ordinals/v1/inscriptions?address=<bitcoinWallet>
      const response = await axios.get(
        `https://api.hiro.so/ordinals/v1/inscriptions?address=${bitcoinWallet}`
      );

      res.status(200).send(response.data);
    } catch (error) {
      console.log(error);
      res.status(400).send({ message: error });
    }
  }
);

export { router as getUserOrdinalsRouter };
