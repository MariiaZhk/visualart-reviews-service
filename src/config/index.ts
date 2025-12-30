import dotenv from "dotenv";
dotenv.config();

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is not defined`);
  }
  return value;
}

export const PORT = Number(process.env.PORT) || 4002;
export const DB_HOST = requireEnv("DB_HOST");
export const ARTWORKS_SERVICE_URL = requireEnv("ARTWORKS_SERVICE_URL");
