import express from "express";
import cors from "cors";
import morgan from "morgan";
import reviewsRoutes from "./routes/reviewsRoutes";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());

app.use("/api/reviews", reviewsRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use(errorHandler);

export default app;
