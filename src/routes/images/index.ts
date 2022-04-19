import express, { Request, Response } from "express";
import { getImagesDir, getResizedImageName } from "./../../utils/util";
import sharp from "sharp";
import path from "path";
const imagesRoutes = express.Router();

imagesRoutes.get("/", async (req: Request, res: Response) => {
  const { filename, width, height } = req.query;
  const originalImageFile: string = path.join(
    getImagesDir(__dirname, "full"),
    (filename as string) + ".jpg"
  );
  const resizedImagePath: string = path.join(
    getImagesDir(__dirname, "thumbs"),
    getResizedImageName(filename as string, width as string, height as string)
  );

  if (!(width || height)) {
    // width & height are undefined
    res.sendFile(originalImageFile);
    return;
  } else if (width && height) {
    //width & height are defined
    await sharp(originalImageFile as string)
      .resize(+(width as unknown as number), +(height as unknown as number))
      .toFile(resizedImagePath);
  } else {
    // height or width undefined
    const resizeFactor: number = width
      ? +(width as unknown as number)
      : +(height as unknown as number);
    await sharp(originalImageFile as string)
      .resize(resizeFactor)
      .toFile(resizedImagePath);
  }
  res.sendFile(resizedImagePath);
  return;
});

export default imagesRoutes;
