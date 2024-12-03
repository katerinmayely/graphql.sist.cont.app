const { GraphQLScalarType, Kind } = require('graphql');

const dateScalar = new GraphQLScalarType({
    name: 'Date',
    description: 'Custom Date scalar type for handling ISO date strings',
    serialize(value) {
        // Convertir a string en formato ISO
        return value instanceof Date ? value.toISOString() : null;
    },
    parseValue(value) {
        // Recibir como entrada un string en formato ISO y convertirlo a Date
        return new Date(value);
    },
    parseLiteral(ast) {
        if (ast.kind === Kind.STRING) {
            // Validar y convertir strings literales
            return new Date(ast.value);
        }
        return null; // Invalid value
    },
});

module.exports = dateScalar;