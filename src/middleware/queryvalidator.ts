import { NextFunction, Request, Response } from "express";
import { checkFileExists, getImagesDir, getImagePath } from "../utils";
import Joi from "joi";

const scheme = Joi.object({
  filename: Joi.string().min(3).required(),
  width: Joi.number().integer().greater(0),
  height: Joi.number().integer().greater(0),
});

const imagesPath = getImagesDir(__dirname, "full");
const queryValidator = (req: Request, res: Response, next: NextFunction) => {
  // Validate query schema
  const validator = scheme.validate(req.query);
  if (validator.error) {
    res.status(400).send(validator.error.details[0].message);
    return;
  }

  // Validate if input image exists
  if (
    !checkFileExists(
      getImagePath(
        imagesPath,
        req.query.filename as string,
        undefined,
        undefined
      )
    )
  ) {
    res.status(404).send("[Image Not Found]: Image file does not exist");
    return;
  }
  next();
};

export default queryValidator;
