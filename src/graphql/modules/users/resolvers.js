import User from "../../../models/User";
import { USER_LOGGED_IN } from "./channels";
import { USER_LOGGED_OUT } from "./channels";

export default {
  Mutation: {
    login: async (_, { data }, { pubSub }) => {
      let user = await User.findOneAndUpdate({ nickname: data.nickname }, { isActive: true }, { new: true });

      if (!user) user = User.create(data);

      pubSub.publish(USER_LOGGED_IN, { userLoggedIn: user });
      return user;
    },
    logout: async (_, { data }, { pubSub }) => {
      const user = await User.findOneAndUpdate(data.id, { isActive: false }, { new: true });
      pubSub.publish(USER_LOGGED_OUT, { userLoggedOut: user });
      return user;
    },
  },
  Subscription: {
    userLoggedIn: {
      subscribe: (obj, args, { pubSub }) => pubSub.asyncIterator(USER_LOGGED_IN),
    },
    userLoggedOut: {
      subscribe: (obj, args, { pubSub }) => pubSub.asyncIterator(USER_LOGGED_OUT),
    },
  },
};
