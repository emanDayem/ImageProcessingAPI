import { NextFunction, Request, Response } from "express";
import {
  checkFileExists,
  getResizedImageName,
  createDirIfNotExists,
  getImagesDir,
} from "../utils/util";
import path from "path";

const cachedImagesPath = getImagesDir(__dirname, "thumbs");
const cacheChecker = (req: Request, res: Response, next: NextFunction) => {
  const { filename, width, height } = req.query;
  const resizedImageName: string = getResizedImageName(
    filename as string,
    width as string,
    height as string
  );
  if (checkFileExists(cachedImagesPath, resizedImageName)) {
    res.sendFile(path.join(cachedImagesPath, resizedImageName));
    return;
  }
  createDirIfNotExists(cachedImagesPath);
  next();
};

export default cacheChecker;
