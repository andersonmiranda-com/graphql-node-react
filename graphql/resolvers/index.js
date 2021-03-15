const Event = require('../../models/event');
const User = require('../../models/user');
const bcrypt = require('bcrypt');

module.exports = {

    events: async () => {
        try {
            const events = await Event.find().populate('creator');
            return events;
        } catch {
            throw err;
        }
    },

    createEvent: async (args) => {
        try {
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date),
                creator: '604cf3c0d8689181c491a7bf'
            });

            const createdEvent = await event.save();
            const user = await User.findById('604cf3c0d8689181c491a7bf');
            if (!user) {
                throw new Error('User not found!');
            }
            user.createdEvents.push(event);
            await user.save();
            return createdEvent;
        } catch {
            console.log(err);
            throw err;
        };
    },

    users: async () => {
        try {
            const user = await User.find().populate('createdEvents');
            return user;
        } catch {
            throw err
        }
    },

    createUser: async (args) => {
        try {
            let user = await User.findOne({ email: args.userInput.email });
            if (user) {
                throw new Error('User exists already.');
            }
            hashedPassword = await bcrypt.hash(args.userInput.password, 12);
            user = new User({
                email: args.userInput.email,
                password: hashedPassword
            });
            const result = await user.save();
            return { ...result._doc, password: null }
        } catch {
            throw err;
        }
    }

};