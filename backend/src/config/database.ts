import sql from "mssql";
import { env } from "./env.js";

const config: sql.config = {
  server: env.DB_SERVER,
  port: env.DB_PORT,
  database: env.DB_DATABASE,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  options: {
    encrypt: env.DB_ENCRYPT === "true",
    trustServerCertificate: env.DB_TRUST_SERVER_CERTIFICATE === "true"
  },
  pool: {
    max: env.DB_POOL_MAX,
    min: env.DB_POOL_MIN,
    idleTimeoutMillis: env.DB_POOL_IDLE_TIMEOUT
  }
};

let poolPromise: Promise<sql.ConnectionPool> | undefined;

export function getDbPool(): Promise<sql.ConnectionPool> {
  if (!poolPromise) {
    poolPromise = new sql.ConnectionPool(config)
      .connect()
      .then(pool => {
        console.log("Connected to SQL Server");
        return pool;
      })
      .catch(error => {
        poolPromise = undefined;
        throw error;
      });
  }

  return poolPromise;
}

export { sql };
