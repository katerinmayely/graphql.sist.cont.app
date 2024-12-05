require('dotenv').config();
const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express'); // Servidor que nos va ayudar a enviar las queries
const morgan = require('morgan');
const cors = require('cors');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const authMiddleware = require('./middlewares/auth');

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(authMiddleware);

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
        return { user: req.user };
    },
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