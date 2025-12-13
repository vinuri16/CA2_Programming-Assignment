const { Pool } = require("pg");
require("dotenv").config();

// Create a connection pool
const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || "plant_inventory_db",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test the connection
pool.on("connect", () => {
  console.log("✅ Database connection pool established");
});

pool.on("error", (err) => {
  console.error("❌ Unexpected error on idle client", err);
  process.exit(-1);
});

module.exports = pool;
