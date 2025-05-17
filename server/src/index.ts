import express, { Request, Response } from "express";
import cors from "cors";
import { storyCardRouter } from "./routes/storyCard.routes";
import { errorHandler } from "./middleware/error.middleware";

const app = express();

app.use(cors(), express.json());
app.use("/cards", storyCardRouter);
app.use(errorHandler);

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
