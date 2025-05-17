import dotenv from "dotenv";
dotenv.config();

export const {
  POSTGRES_HOST,
  POSTGRES_PORT = "5432",
  POSTGRES_DB,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  PORT = "4000",
} = process.env;
