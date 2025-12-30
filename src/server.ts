import mongoose from "mongoose";
import app from "./app";
import { PORT, DB_HOST } from "./config";

mongoose
  .connect(DB_HOST)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
