const { getConnection, sql } = require("../DB/db");
const dateScalar = require('../utils/scalarDate');

const usuarioResolvers = {
    Date: dateScalar,
    Query: {
        usuarios: async (_, args) => {
            try {
                const pool = await getConnection();
                const request = pool.request();

                let query = `
                    SELECT * 
                    FROM proyecto_expertos.users
                    WHERE 1=1
                `;

                // Si se pasa el argumento 'email', lo usamos para filtrar
                if (args.email) {
                    request.input('email', sql.NVarChar, args.email);  // Usamos sql.NVarChar para el tipo de dato String
                    query += `
                        AND email = @email
                    `;
                }

                const result = await request.query(query);
                return result.recordset;

            } catch (error) {
                console.error(error);
                throw error;
            }
        }
    },
    Usuario: {
        cuentas: async (parent) => {  // Resolver para obtener las cuentas de un usuario
            try {
                const pool = await getConnection();
                const cuentas = await pool.request()
                    .input('user_id', sql.Int, parent.id)  // Usamos 'parent.id' para asociar con el usuario
                    .query(`
                        SELECT id, account_name, total
                        FROM proyecto_expertos.accounts
                        WHERE user_id = @user_id;
                    `);
                return cuentas.recordset;  // Retorna las cuentas asociadas al usuario
            } catch (error) {
                console.error(error);
                throw error;
            }
        }
    },
    Cuenta: {
        transacciones: async (parent) => {  // Resolver para obtener las transacciones de una cuenta
            try {
                const pool = await getConnection();
                const transacciones = await pool.request()
                    .input('account_id', sql.Int, parent.id)  // Usa 'parent.id' para asociar con la cuenta
                    .query(`
                        SELECT *
                        FROM proyecto_expertos.transactions
                        WHERE account_id = @account_id;
                    `);
                return transacciones.recordset;  // Retorna las transacciones asociadas a la cuenta
            } catch (error) {
                console.error(error);
                throw error;
            }
        }
    },
    Transaccion: {
        etiquetas: async (parent) => {  // Resolver para obtener las transacciones de una cuenta
            try {
                const pool = await getConnection();
                const etiquetas = await pool.request()
                    .input('id', sql.Int, parent.id)  // Usa 'parent.id' para asociar con la cuenta
                    .query(`
                        SELECT T.id, T.name
                        FROM proyecto_expertos.transaction_tags TT
                        LEFT JOIN proyecto_expertos.tags T ON TT.tag_id = T.id
                        LEFT JOIN proyecto_expertos.transactions TR ON TT.transaction_id = TR.id
                        WHERE 1 = 1
                        AND TR.id = @id;
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

module.exports = usuarioResolvers;