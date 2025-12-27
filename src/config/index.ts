import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 4002;
export const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://username:password@cluster.mongodb.net/dbname";
export const ARTWORKS_SERVICE_URL =
  process.env.ARTWORKS_SERVICE_URL || "http://localhost:3001";
