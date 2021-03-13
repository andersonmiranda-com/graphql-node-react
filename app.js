const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Event = require('./models/event');
const User = require('./models/user');

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
            creator: String!
        }

        type User {
            _id: ID!
            email: String!
            password: String
        }

        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        input UserInput {
            email: String!
            password: String!
        }
        
        type RootQuery {
            events: [Event!]!
            users: [User]!
        }

        type RootMutation {
            createEvent(eventInput: EventInput): Event
            createUser(userInput: UserInput): User
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
                    date: new Date(args.eventInput.date),
                    creator: '604cf3c0d8689181c491a7bf'
                })
                let createdEvent;
                return event
                    .save()
                    .then(result => {
                        createdEvent = result;
                        return User.findById('604cf3c0d8689181c491a7bf')
                    })
                    .then(user => {
                        if (!user) {
                            throw new Error('User not found!');
                        }
                        user.createdEvents.push(event);
                        return user.save();

                    })
                    .then(result => {
                        return createdEvent;
                    })
                    .catch(err => {
                        console.log(err);
                        throw err
                    });
                return event;
            },
            users: () => {
                return User.find().then(users => {
                    console.log(users);
                    return users;

                }).catch(err => {
                    console.log(err);
                    throw err
                });
            },
            createUser: (args) => {
                return User
                    .findOne({ email: args.userInput.email })
                    .then(user => {
                        if (user) {
                            throw new Error('User exists already.');
                        }
                        return bcrypt
                            .hash(args.userInput.password, 12);
                    })
                    .then(hashedPassword => {
                        console.log(hashedPassword);
                        const user = new User({
                            email: args.userInput.email,
                            password: hashedPassword
                        });
                        return user.save();
                    })
                    .then(result => {
                        return { ...result._doc, password: null }
                    })
                    .catch(err => {
                        throw err;
                    })
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

