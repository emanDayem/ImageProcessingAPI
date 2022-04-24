import sharp from "sharp";

const sharpResizeByWidthAndHeight = async (
  inFilePath: string,
  outFilePath: string,
  width: number,
  height: number
): Promise<void> => {
  await sharp(inFilePath as string)
    .resize(width, height)
    .toFile(outFilePath);
};

const sharpResizeByOneFactor = async (
  inFilePath: string,
  outFilePath: string,
  resizeFactor: number
): Promise<void> => {
  await sharp(inFilePath as string)
    .resize(resizeFactor)
    .toFile(outFilePath);
};

export const resize = async (
  inFilePath: string,
  outFilePath: string,
  width: number | undefined,
  height: number | undefined
): Promise<void> => {
  if (!(width || height)) return;
  //width & height are defined
  if (width && height) {
    await sharpResizeByWidthAndHeight(inFilePath, outFilePath, width, height);
  } else {
    // height or width undefined
    const resizeFactor: number = width
      ? +(width as unknown as number)
      : +(height as unknown as number);
    await sharpResizeByOneFactor(inFilePath, outFilePath, resizeFactor);
  }
};
