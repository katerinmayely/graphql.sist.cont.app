const { getConnection, sql } = require("../DB/db");

const etiquetaResolvers = {
    Query: {
        etiquetas: async ( _, args ) => {
            try {
                const pool = await getConnection();
                const request = pool.request();

                let query = `
                    SELECT T.id, T.name
                    FROM proyecto_expertos.transaction_tags TT
                    LEFT JOIN proyecto_expertos.tags T ON TT.tag_id = T.id
                    LEFT JOIN proyecto_expertos.transactions TR ON TT.transaction_id = TR.id
                    WHERE 1 = 1
                `

                if(args.user_id){
                    request.input('user_id', sql.Int, args.user_id)
                    query += `
                        AND TR.user_id = @user_id;
                    `
                }
                
                let result = await request.query(query);
                return result.recordset;

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