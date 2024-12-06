const { getConnection } = require("../DB/db");

const cuentasResolvers = {
    Query: {
        cuentas: async () => {
            try {
                const pool = await getConnection();
                const result = await pool.request().query(`
                        SELECT * FROM proyecto_expertos.accounts;
                    `)
                return result.recordset
            } catch (error) {
                console.error(error);
                throw error;
            }
        }
    }
}

module.exports = {
    cuentasResolvers
}