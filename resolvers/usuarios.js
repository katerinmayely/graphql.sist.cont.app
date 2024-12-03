const { getConnection, sql } = require("../DB/db");

const dateScalar = require('../utils/scalarDate');

const ususarioResolvers = {
    Date: dateScalar, // Registrar el scalar aquí
    Query: {
        usuario: async () => {
            try {
                const pool = await getConnection();
                const usuarios = await pool.request().query(`
                        SELECT * FROM proyecto_expertos.users;
                    `);
                // Devuelve el resultado directamente
                return usuarios.recordset.map(transaccion => ({
                    ...transaccion,
                    transaction_date: transaccion.transaction_date // Asegura que las fechas sean válidas
                }));
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
    },
    Transaccion: {
        etiquetas: async ( parent ) => {
            try {
                const pool = await getConnection();
                const etiquetas = await pool.request()
                .input('transaction_id', sql.Int, parent.id)
                .query(`
                        SELECT id, name
                        FROM proyecto_expertos.transaction_tags TT
                        INNER JOIN proyecto_expertos.tags T
                        ON TT.transaction_id = T.id
                        WHERE transaction_id = @transaction_id;
                    `);

                return etiquetas.recordset.map(etiqueta => ({
                    etiqueta: {
                        id: etiqueta.id,
                        name: etiqueta.name
                    }
                }));
                    
            } catch (error) {
                console.error(error);
                throw error;
            }
        }
    }
};

module.exports = ususariosResolvers;