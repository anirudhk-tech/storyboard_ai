import { Pool, PoolConfig } from "pg";
import {
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB,
} from "../../config/index";

const pgCongig: PoolConfig = {
  host: POSTGRES_HOST,
  port: parseInt(POSTGRES_PORT || "5432", 10),
  user: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DB,
  max: 10,
  idleTimeoutMillis: 30000,
};

const pool = new Pool(pgCongig);

pool
  .connect()
  .then((client) => {
    console.log("✅ Connected to PostgreSQL");
    client.release();
  })
  .catch((err) => {
    console.error("❌ Error connecting to PostgreSQL", err);
    process.exit(1);
  });

export default pool;
