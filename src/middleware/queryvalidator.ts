import { NextFunction, Request, Response } from "express";
import { checkFileExists, getImagesDir } from "../utils/util";
import Joi from "joi";

const scheme = Joi.object({
  filename: Joi.string().min(3).required(),
  width: Joi.number().integer(),
  height: Joi.number().integer(),
});

const imagesPath = getImagesDir(__dirname, "full");
const queryValidator = (req: Request, res: Response, next: NextFunction) => {
  const validator = scheme.validate(req.query);
  if (validator.error) {
    res.status(400).send(validator.error.details[0].message);
    return;
  }
  if (!checkFileExists(imagesPath, (req.query.filename as string) + ".jpg")) {
    res.status(404).send("[Image Not Found]: Image file does not exist");
    return;
  }
  next();
};

export default queryValidator;
