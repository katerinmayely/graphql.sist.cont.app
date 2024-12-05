const {gql} = require('apollo-server-express')

const typeDefs = gql`
    scalar Date

    type Usuario{
        id: ID!
        email: String!
        firstname: String 
        lastname: String
        register_date: Date
        active: Int
        actived_at: Date
        cuentas: [Cuenta]
    }

    type Cuenta{
        id: ID!
        account_name: String!
        total: Float
        transacciones: [Transaccion]
    }

    type Transaccion {
        id: ID!
        transaction_date: Date
        description: String
        amount: Float
        current_balance: Float
        etiquetas: [TransaccionEtiqueta]
    }

    type Etiqueta {
        id: ID!
        name: String!
        transacciones: [TransaccionEtiqueta]
    }

    type TransaccionEtiqueta {
        transaccion: Transaccion
        etiqueta: Etiqueta
    }

    type CodigoActivacion {
        id: ID!
        email: String!
        code: Int
        created_at: Date
        expired_at: Date
    }

    type ConteoTransaccionesTag {
        conteo: Int
        tag: Etiqueta
    }

    type Query {
        usuarios( email: String ): [Usuario]
        cuentas: [Cuenta]
        transacciones: [Transaccion] 
        etiquetas( id_user: Int ): [Etiqueta]
        codigos: [CodigoActivacion]
        conteoTransaccionesTag ( id_user: Int ): [ConteoTransaccionesTag]
    }
`;

module.exports = typeDefs;