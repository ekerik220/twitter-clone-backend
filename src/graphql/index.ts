import * as rootTypes from "./rootTypes.graphql";
import * as userTypes from "./user/userTypes.graphql";
import * as authenticationTypes from "./authentication/authenticationTypes.graphql";
import * as tweetTypes from "./tweet/tweetTypes.graphql";
import * as hashtagTypes from "./hashtag/hashtagTypes.graphql";

import { scalarResolvers } from "./scalars";
import { userResolvers } from "./user/userResolvers";
import { authenticationResolvers } from "./authentication/authenticationResolvers";
import { tweetResolvers } from "./tweet/tweetResolvers";
import { hashtagResolvers } from "./hashtag/hashtagResolvers";

export const typeDefs = [
  rootTypes,
  userTypes,
  authenticationTypes,
  tweetTypes,
  hashtagTypes,
];
export const resolvers = [
  scalarResolvers,
  userResolvers,
  authenticationResolvers,
  tweetResolvers,
  hashtagResolvers,
];
