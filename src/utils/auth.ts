import jwt from "jsonwebtoken";
import { ApolloError } from "apollo-server";

type LoginToken = {
  id: string;
};

/* Takes a token and returns the user id contained inside */
export const getUser = (token: string): string => {
  try {
    const { id } = <LoginToken>jwt.verify(token, process.env.JWT_SECRET || "");
    return id;
  } catch (err) {
    throw new ApolloError(err.message, err.name);
  }
};
