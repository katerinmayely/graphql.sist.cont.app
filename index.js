require('dotenv').config();
const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express'); // Servidor que nos va ayudar a enviar las queries
const morgan = require('morgan');
const cors = require('cors');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const app = express();

// Configuración de CORS
const corsOptions = {
    origin: 'https://studio.apollographql.com', // Permitir solo Apollo Studio
    credentials: true, // Permitir cookies o credenciales
};
app.use(cors(corsOptions));

app.use(morgan('dev'));

const server = new ApolloServer({
    typeDefs,
    resolvers

});

async function startServer() {
    await server.start();
    server.applyMiddleware({app});

    const PORT = process.env.PORT || 4000;

    app.listen( PORT, () => {
        console.log(`Server up on port ${PORT} ${server.graphqlPath}`);
    })
}

startServer();