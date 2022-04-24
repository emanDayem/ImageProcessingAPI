import express, { Request, Response } from "express";
import { getImagesDir, getImagePath } from "../../utils";
import { resize } from "../../utils/imageProcessing";
const imagesRoutes = express.Router();

imagesRoutes.get("/", async (req: Request, res: Response): Promise<void> => {
  const { filename, width, height } = req.query;
  const originalImageFile: string = getImagePath(
    getImagesDir(__dirname, "full"),
    filename as string,
    undefined,
    undefined
  );
  const resizedImagePath: string = getImagePath(
    getImagesDir(__dirname, "thumbs"),
    filename as string,
    width as string,
    height as string
  );

  if (!(width || height)) {
    // width & height are undefined
    res.sendFile(originalImageFile);
    return;
  } else {
    await resize(
      originalImageFile,
      resizedImagePath,
      +(width as unknown as number),
      +(height as unknown as number)
    );
  }
  res.sendFile(resizedImagePath);
  return;
});

export default imagesRoutes;
