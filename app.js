const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');

const graphqlSchema = require('./graphql/schema');
const graphqlRootValue = require('./graphql/resolvers');

const app = express();
app.use(express.json());

const events = [];

app.get('/', (req, res, next) => {
    res.send('Welcome to GraphQL Backend');
});

app.use('/graphql',
    graphqlHTTP({
        schema: graphqlSchema,
        rootValue: graphqlRootValue,
        graphiql: true
    })
);

mongoose
    .connect('mongodb://localhost:27017/graphqlDemo',
        { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => {
        app.listen(3000, () => {
            console.log('Server started at http://localhost:3000');
        });
    })
    .catch(err => {
        console.log(err);
    })

