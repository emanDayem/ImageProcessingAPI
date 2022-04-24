import express, { Request, Response } from "express";
import path from "path";
import imagesRoutes from "./routes/images";
import queryValidator from "./middleware/queryvalidator";
import cacheChecker from "./middleware/cacheChecker";

export const app = express();
const port = 3000;

app.get("/", (_req: Request, res: Response): void => {
  res.status(200).sendFile(path.join(__dirname, "index.html"));
});

app.use(express.json());
app.use(queryValidator);
app.use(cacheChecker);
app.use("/images", imagesRoutes);

app.listen(port, (): void => {
  console.log(`Server started at http:\\localhost:${port}`);
});
