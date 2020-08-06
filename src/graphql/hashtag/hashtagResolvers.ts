import { Context } from "../../main";

export const hashtagResolvers = {
  Query: {
    trending: async (
      parent: any,
      args: any,
      { models: { hashtagModel } }: Context
    ) => {
      const trendingHashtags = await hashtagModel
        .find()
        .sort({ numOfTweets: -1 })
        .limit(50);
      return trendingHashtags;
    },
  },
};
