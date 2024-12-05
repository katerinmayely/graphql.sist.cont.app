const { mergeResolers, mergeResolvers } = require('@graphql-tools/merge');
const { etiquetaResolvers } = require('./etiquetas');
const transaccionResolvers = require('./transacciones');
const usuarioResolvers = require('./usuarios');
const { cuentasResolvers } = require('./cuentas');
const { conteoTransaccionesTagResovers } = require('./conteoTransaccionesTags');

const resolversArray = [
    etiquetaResolvers,
    transaccionResolvers,
    usuarioResolvers,
    cuentasResolvers,
    conteoTransaccionesTagResovers
];

const resolvers = mergeResolvers(resolversArray);

module.exports = resolvers;