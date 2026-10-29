const sql = require("mssql");
require("dotenv").config();

const config = {
    server: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 1433,

    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

async function connectDB() {
    try {
        await sql.connect(config);
        console.log("✅Database Connected successfully")
    } catch (err) {
        console.error("❌ Database Connection Failed");
        console.error(err);
    }
}

module.exports = {
    connectDB,
    sql,
    config
};