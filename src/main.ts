import { ApolloServer } from "apollo-server";
import mongoose from "mongoose";
import { environment } from "./environment";
import { typeDefs, resolvers } from "./graphql";
import { DIRECTIVES } from "@graphql-codegen/typescript-mongodb";
import userModel, { UserDocument } from "./mongodb/userModel";
import unconfirmedUserModel, {
  UnconfirmedUserDocument,
} from "./mongodb/unconfirmedUserModel";
import tweetModel, { TweetDocument } from "./mongodb/tweetModel";
import { getUser } from "./utils/auth";
import hashtagModel, { HashtagDocument } from "./mongodb/hashtagModel";
import listModel, { ListDocument } from "./mongodb/listModel";

export interface Context {
  models: {
    userModel: mongoose.Model<UserDocument, {}>;
    unconfirmedUserModel: mongoose.Model<UnconfirmedUserDocument, {}>;
    tweetModel: mongoose.Model<TweetDocument, {}>;
    hashtagModel: mongoose.Model<HashtagDocument, {}>;
    listModel: mongoose.Model<ListDocument, {}>;
  };
  user: string | undefined;
}

// Set up server
const server = new ApolloServer({
  typeDefs: [DIRECTIVES, ...typeDefs],
  resolvers,
  introspection: environment.apollo.introspection,
  playground: environment.apollo.playground,
  context: ({ req }): Context => ({
    models: {
      userModel,
      unconfirmedUserModel,
      tweetModel,
      hashtagModel,
      listModel,
    },
    user: req.headers.authorization
      ? getUser(req.headers.authorization)
      : undefined,
  }),
});

// Connect to MongoDB database
mongoose.connect(
  environment.mongoDB.url,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => console.log("Connected to DB!")
);

// Start server
server
  .listen(environment.port)
  .then(({ url }) => console.log(`Server ready at ${url}`));

// Hot Module Replacement
if (module.hot) {
  module.hot.accept();
  module.hot.dispose(() => {
    server.stop();
    mongoose.connection.close();
  });
}
