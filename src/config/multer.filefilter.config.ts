import { Request } from "express";
import multer, { FileFilterCallback } from "multer";
import path from "path";
export default multer({
  storage: multer.diskStorage({}),
  fileFilter: (
    request: Request,
    file: Express.Multer.File,
    callback: FileFilterCallback
  ): void => {
    let ext = path.extname(file.originalname);
    if (
      ext !== ".jpg" &&
      ext !== ".jpeg" &&
      ext !== ".png" &&
      ext !== ".mp4" &&
      ext !== "m4v" &&
      ext != "mov"
    ) {
      callback(null, false);
      return;
    }
    callback(null, true);
  },
});
