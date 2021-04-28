import User from "../../../models/User";
import { USER_STATUS_CHANGED } from "./channels";

export default {
  Mutation: {
    login: async (_, { data }, { pubSub }) => {
      let user = await User.findOneAndUpdate(
        { nickname: data.nickname },
        { isActive: true },
        { new: true }
      );

      // Evita abusos (nickname de no máximo 10 caracteres)
      data.nickname = data.nickname.substr(0, 10);
      if (!user) user = User.create(data);

      pubSub.publish(USER_STATUS_CHANGED, { userStatusChanged: user });
      return user;
    },
    logout: async (_, { data }, { pubSub }) => {
      const user = await User.findOneAndUpdate(
        { nickname: data.nickname },
        { isActive: false },
        { new: true }
      );
      pubSub.publish(USER_STATUS_CHANGED, { userStatusChanged: user });
      return user;
    },
  },
  Subscription: {
    userStatusChanged: {
      subscribe: (obj, args, { pubSub }) => pubSub.asyncIterator(USER_STATUS_CHANGED),
    },
  },
};
