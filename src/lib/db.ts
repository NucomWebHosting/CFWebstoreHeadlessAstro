import sql from "mssql";

const config: sql.config = {
  server: import.meta.env.MSSQL_SERVER,
  database: import.meta.env.MSSQL_DATABASE,
  user: import.meta.env.MSSQL_USER,
  password: import.meta.env.MSSQL_PASSWORD,
  port: Number(import.meta.env.MSSQL_PORT ?? 1433),
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
  pool: {
    max: 10,
    min: 2,
    idleTimeoutMillis: 30000,
  },
  connectionTimeout: 15000,
  requestTimeout: 15000,
};

// Singleton pool — created once per Node.js process, reused across all requests
let pool: sql.ConnectionPool | null = null;

export async function getPool(): Promise<sql.ConnectionPool> {
  if (pool && pool.connected) {
    return pool;
  }
  pool = await new sql.ConnectionPool(config).connect();
  return pool;
}

// Convenience helper: run a parameterized query and return typed rows
export async function query<T>(
  queryText: string,
  params?: Record<string, string | number | boolean | null>
): Promise<T[]> {
  const p = await getPool();
  const req = p.request();
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      req.input(key, value);
    }
  }
  const result = await req.query<T>(queryText);
  return result.recordset;
}
