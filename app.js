const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();
app.use(express.json());

app.get('/', (req, res, next) => {
    res.send('Hello World');
});

app.use('/graphql',
    graphqlHTTP({
        schema: buildSchema(`
        
        type RootQuery {
            events: [String!]!
        }

        type RootMutation {
            createEvent(name: String): String
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }

    `),
        rootValue: {
            events: () => {
                return ['NodeJs training', 'CTO Meeting', 'Cooking a paella']
            },
            createEevent: (args) => {
                const eventName = args.name;
                return eventName;
            }
        },
        graphiql: true
    })
);

app.listen(3000, () => {
    console.log('Server started at http://localhost:3000');
});