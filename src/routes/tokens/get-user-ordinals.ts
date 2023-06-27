import express, { Request, Response } from "express";
import axios from "axios";

const router = express.Router();

router.get(
  "/api/token/ordinal/:address",
  async (req: Request, res: Response) => {
    try {
      const { address } = req.params;

      // get all the ordinals from https://api.hiro.so/ordinals/v1/inscriptions?address=<address>
      const response = await axios.get(
        `https://api.hiro.so/ordinals/v1/inscriptions?address=${address}`
      );

      res.status(200).send(response.data);
    } catch (error) {
      console.log(error);
      res.status(400).send({ message: error });
    }
  }
);

export { router as getUserOrdinalsRouter };
