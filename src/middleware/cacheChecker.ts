import { NextFunction, Request, Response } from "express";
import {
  checkFileExists,
  getImagePath,
  createDirIfNotExists,
  getImagesDir,
} from "../utils";

const cachedImagesPath = getImagesDir(__dirname, "thumbs");
const cacheChecker = (req: Request, res: Response, next: NextFunction) => {
  const { filename, width, height } = req.query;
  const resizedImagePath: string = getImagePath(
    cachedImagesPath,
    filename as string,
    width as string,
    height as string
  );
  if (checkFileExists(resizedImagePath)) {
    res.sendFile(resizedImagePath);
    return;
  }
  createDirIfNotExists(cachedImagesPath);
  next();
};

export default cacheChecker;
