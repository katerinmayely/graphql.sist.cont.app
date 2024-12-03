const { mergeResolers, mergeResolvers } = require('@graphql-tools/merge');
const { etiquetaResolvers } = require('./etiquetas');
const transaccionResolvers = require('./transacciones');

const resolversArray = [
    etiquetaResolvers,
    transaccionResolvers
];

const resolvers = mergeResolvers(resolversArray);

module.exports = resolvers;