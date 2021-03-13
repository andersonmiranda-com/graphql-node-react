const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const Event = require('./models/event');

const app = express();
app.use(express.json());

const events = [];

app.get('/', (req, res, next) => {
    res.send('Hello World');
});

app.use('/graphql',
    graphqlHTTP({
        schema: buildSchema(`

        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }
        
        type RootQuery {
            events: [Event!]!
        }

        type RootMutation {
            createEvent(eventInput: EventInput): Event
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }

    `),
        rootValue: {
            events: () => {
                return Event.find().then(events => {
                    console.log(events);
                    return events;

                }).catch(err => {
                    console.log(err);
                    throw err
                });
            },
            createEvent: (args) => {
                const event = new Event({
                    title: args.eventInput.title,
                    description: args.eventInput.description,
                    price: +args.eventInput.price,
                    date: new Date(args.eventInput.date)
                })
                return event
                    .save()
                    .then(result => {
                        console.log(result);
                        return result;
                    })
                    .catch(err => {
                        console.log(err);
                        throw err
                    });
                return event;
            }
        },
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

