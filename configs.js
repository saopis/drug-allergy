require('dotenv').config();
const mysql = require('mysql2/promise');
const HPCODE = process.env.HPCODE || 11425;
const PORT = process.env.PORT || 5000;
const hosConfig = {
    host: process.env.HOS_DB_HOST || 'localhost',
    user: process.env.HOS_DB_USER || 'root',
    password: process.env.HOS_DB_PASSWORD || '',
    database: process.env.HOS_DB_DATABASE || 'hos',
    port: process.env.HOS_DB_PORT || 3306,
};
const hosConnectionPool = mysql.createPool({
    ...hosConfig,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
    idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
});

const centralConfig = {
    host: process.env.CENTRAL_DB_HOST || 'localhost',
    user: process.env.CENTRAL_DB_USER || 'root',
    password: process.env.CENTRAL_DB_PASSWORD || '',
    database: process.env.CENTRAL_DB_DATABASE || 'central',
    port: process.env.CENTRAL_DB_PORT || 3306,
}
const centralConnectionPool = mysql.createPool({
    ...centralConfig,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
    idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
});

module.exports = {
    PORT,
    HPCODE,
    hosConfig,
    hosConnectionPool,
    centralConfig,
    centralConnectionPool
}