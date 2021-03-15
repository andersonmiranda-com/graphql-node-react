const Event = require('../../models/event');
const User = require('../../models/user');
const bcrypt = require('bcrypt');

module.exports = {
    events: () => {
        return Event
            .find()
            .populate('creator')
            .then(events => events)
            .catch(err => {
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
        return User
            .find()
            .populate('createdEvents')
            .then(users => users)
            .catch(err => {
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
};