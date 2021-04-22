import Message from "../../../models/Message";
import User from "../../../models/User";
import { NEW_MESSAGE } from "./channels";

export default {
  Message: {
    author: message => User.findById(message.author),
  },
  Query: {
    messages: () => Message.find(),
    message: (_, { id }) => Message.findById(id),
  },
  Mutation: {
    createMessage: (_, { data }, { pubSub }) => {
      const message = Message.create(data);
      pubSub.publish(NEW_MESSAGE, { newMessage: message });
      return message;
    },
  },
  Subscription: {
    newMessage: {
      subscribe: (obj, args, { pubSub }) => pubSub.asyncIterator(NEW_MESSAGE),
    },
  },
};
