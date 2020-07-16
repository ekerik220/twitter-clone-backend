import * as rootTypes from "./rootTypes.graphql";
import * as userTypes from "./user/userTypes.graphql";
import * as authenticationTypes from "./authentication/authenticationTypes.graphql";

import { scalarResolvers } from "./scalars";
import { userResolvers } from "./user/userResolvers";
import { authenticationResolvers } from "./authentication/authenticationResolvers";

export const typeDefs = [rootTypes, userTypes, authenticationTypes];
export const resolvers = [
  scalarResolvers,
  userResolvers,
  authenticationResolvers,
];
