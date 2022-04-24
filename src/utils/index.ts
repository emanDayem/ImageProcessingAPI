import fs from "fs";
import path from "path";

export const checkFileExists = (filePath: string): boolean => {
  return fs.existsSync(filePath);
};

export const getImagePath = (
  absolutePath: string,
  fileName: string,
  width: string | undefined,
  height: string | undefined
): string => {
  let imageName = fileName;
  if (width) imageName += "_" + "w" + width;
  if (height) imageName += "_" + "h" + height;
  return path.join(absolutePath, imageName + ".jpg");
};

export const createDirIfNotExists = (path: string): void => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
};

export const getImagesDir = (startDir: string, targetDir: string): string => {
  let imagesDir: string | undefined = "";
  const subDirs: string[] = fs.readdirSync(startDir);

  if (!subDirs.includes("assets")) {
    imagesDir = getImagesDir(path.join(startDir, ".."), targetDir);
    return imagesDir;
  } else {
    imagesDir = path.join(startDir, "assets", targetDir);
    return imagesDir;
  }
};
