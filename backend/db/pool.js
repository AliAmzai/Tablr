import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Test connection
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

export default pool;
