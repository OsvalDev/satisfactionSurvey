import dotenv from 'dotenv';
import sql from 'mssql';

dotenv.config();

const userDB = process.env.DB_DATABASE_USER;
const mainDB = process.env.DB_DATABASE;

const dbConfigs = {
  [userDB]: {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: userDB,
    options: {
      encrypt: true,
      trustServerCertificate: true
    }
  },
  [mainDB]: {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: mainDB,
    options: {
      encrypt: true,
      trustServerCertificate: true
    }
  }
};

const pools = {};

const getPool = (dbName) => {
  if (!pools[dbName]) {
    const dbConfig = dbConfigs[dbName];
    pools[dbName] = new sql.ConnectionPool(dbConfig);
    pools[dbName].connect();
  }
  return pools[dbName];
};

const makeQuery = async (query, values = null, dbName = mainDB) => {
  try {
    const pool = getPool(dbName);
    await pool.connect();
    const request = pool.request();
    if (values) {
      for (const key in values) {
        request.input(key, values[key]);
      }
    }
    const result = await request.query(query);
    return result.recordset;
  } catch (error) {
    throw new Error(`Hubo un error en la base de datos: ${error.message}`);
  }
};

process.on('exit', () => {
  for (const pool in pools) {
    pools[pool].close();
  }
});

export default { makeQuery };
