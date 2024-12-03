const sql = require('mssql');

const dbConfig = {
    user: process.env.SQL_USERNAME,
    password: process.env.SQL_PASSWORD,
    server: process.env.SQL_SERVER,
    database: process.env.SQL_DATABASE,
    options: {
        encrypt: process.env.DB_ENCRYPT === 'true'
    }
}

let pool;

const getConnection = async () => {
    try {

        if(pool){
            return pool;
        }

        pool = await sql.connect(dbConfig);
        return pool;
        
    } catch (error) {
        console.error("Error al conectar a la base de datos.", error);
    }
}

module.exports = {
    sql,
    getConnection
}