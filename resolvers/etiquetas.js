const { getConnection } = require("../DB/db");

const etiquetaResolvers = {
    Query: {
        etiquetas: async () => {
            try {
                const pool = await getConnection();
                const result = await pool.request().query(`
                        SELECT * FROM proyecto_expertos.tags;
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
    etiquetaResolvers
}