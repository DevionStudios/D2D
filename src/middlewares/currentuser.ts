import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

interface UserPayLoad {
  email: string;
  username: string;
  id: string;
}

const currentUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (
      req.headers &&
      req.headers.cookies &&
      req.headers.cookies.includes("foxxi_jwt")
    ) {
      const token = req.headers.cookies
        .toString()
        .split("foxxi_jwt=")[1]
        .split(";")[0];
      if (!token || token === "undefined") {
        req.currentUser = undefined;
      } else {
        const decoded = jwt.verify(token.toString(), process.env.JWT_KEY!);
        if (!decoded) {
          //If some error occurs
          res.status(400).json({
            error: "User not Signed in, Sign in First.",
          });
        } else {
          req.currentUser = decoded as UserPayLoad;
        }
      }
      next();
    } else {
      res.send({ currentuser: null });
    }
  } catch (e) {
    res.status(400).json({
      error: "Malformed jwt token",
    });
  }
};

export { currentUser };
