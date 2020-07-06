import * as userTypes from "./user/userTypes.graphql";

import { scalarResolvers } from "./scalars";
import { userResolvers } from "./user/userResolvers";

export const typeDefs = [userTypes];
export const resolvers = [scalarResolvers, userResolvers];
