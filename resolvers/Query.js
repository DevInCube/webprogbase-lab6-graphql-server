const { UserInputError } = require("apollo-server");

module.exports = {
    me: (parent, args, context) => {
        console.log(context);
        if (!context.user) {
            throw new Error("Not authorized");
        }

        return context.user;
    },
}