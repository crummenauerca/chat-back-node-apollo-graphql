import Message from "../../../models/Message";
import User from "../../../models/User";
import { NEW_MESSAGE } from "./channels";

export default {
  Message: {
    author: message => User.findById(message.author),
  },
  Query: {
    messages: () => Message.find({}).sort({ createdAt: "ascending" }),
  },
  Mutation: {
    createMessage: (_, { data }, { pubSub }) => {
      // Evita abusos (mensagem de no máximo 25 mil caracteres)
      data.content = data.content.substr(0, 25000);
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
