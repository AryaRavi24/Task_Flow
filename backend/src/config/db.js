import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Determine TLS/SSL settings based on environment configuration
// Most cloud/hosted MySQL providers (Aiven, PlanetScale, Railway, AWS RDS, TiDB Cloud) require TLS
const getSslConfig = () => {
  if (process.env.DB_SSL === 'true') {
    const sslConfig = {
      // Set to true by default to strictly verify TLS certificates
      // Can be set to DB_SSL_REJECT_UNAUTHORIZED=false if provider uses self-signed certificates
      rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false',
    };

    // If a custom CA certificate is provided as an environment variable
    if (process.env.DB_CA_CERT) {
      sslConfig.ca = process.env.DB_CA_CERT;
    }

    return sslConfig;
  }

  return undefined;
};

const ssl = getSslConfig();

// Create a MySQL connection pool using mysql2/promise
const poolConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'task_manager_db',
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ...(ssl ? { ssl } : {}),
};

const pool = mysql.createPool(poolConfig);

// Test connection on application startup
export const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log(`✅ Connected to MySQL database: ${process.env.DB_NAME || 'task_manager_db'} on ${process.env.DB_HOST || 'localhost'}`);
    if (ssl) {
      console.log(`🔒 TLS/SSL connection active (rejectUnauthorized: ${ssl.rejectUnauthorized})`);
    } else {
      console.log(`ℹ️ Unencrypted connection (DB_SSL is not enabled)`);
    }
    connection.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    if (error.code === 'HANDSHAKE_SSL_ERROR' || error.message.includes('SSL') || error.message.includes('certificate')) {
      console.error('👉 SSL/TLS Handshake Error: Ensure your hosted MySQL requires SSL and verify DB_SSL / DB_SSL_REJECT_UNAUTHORIZED in .env');
    } else {
      console.error('👉 Check your DB_HOST, DB_USER, DB_PASSWORD, and DB_NAME in environment variables.');
    }
  }
};

export default pool;
