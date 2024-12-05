const { getConnection, sql } = require("../DB/db");

const conteoTransaccionesTagResovers = {
    Query: {
        conteoTransaccionesTag: async ( _, args ) => {
            try {
                const pool = await getConnection();
                const request = pool.request();

                let query = `
                        SELECT TT.tag_id, T.name, COUNT(*) AS transactions
                        FROM proyecto_expertos.transaction_tags TT
                        INNER JOIN proyecto_expertos.tags T ON TT.tag_id = T.id
                        INNER JOIN proyecto_expertos.transactions TR ON TT.transaction_id = TR.id
                        WHERE 1 = 1
                    `

                if(args.id_user){
                    request.input('id_user', sql.Int, args.id_user)
                    query += `
                        AND  TR.user_id = @id_user
                    `
                }

                query += `
                        GROUP BY tag_id, name
                    `

                const result = await request.query(query);
                return result.recordset.map( (row) => ({
                    conteo: row.transactions,
                    tag: {
                        id: row.tag_id,
                        name: row.name
                    }
                }))
            } catch (error) {
                console.error(error);
                throw error;
            }
        }
    }
}

module.exports = {
    conteoTransaccionesTagResovers
}