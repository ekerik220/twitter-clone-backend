import { ApolloServer } from "apollo-server";
import mongoose from "mongoose";
import { environment } from "./environment";
import { typeDefs, resolvers } from "./graphql";
import { DateTimeMock, EmailAddressMock } from "graphql-scalars";
import { DIRECTIVES } from "@graphql-codegen/typescript-mongodb";

import userModel, { UserDocument } from "./mongodb/userModel";
import unconfirmedUserModel, {
  UnconfirmedUserDocument,
} from "./mongodb/unconfirmedUserModel";

export interface Context {
  models: {
    userModel: mongoose.Model<UserDocument, {}>;
    unconfirmedUserModel: mongoose.Model<UnconfirmedUserDocument, {}>;
  };
}

// Set up server
const server = new ApolloServer({
  typeDefs: [DIRECTIVES, ...typeDefs],
  resolvers,
  introspection: environment.apollo.introspection,
  playground: environment.apollo.playground,
  mocks: { DateTime: DateTimeMock, EmailAddress: EmailAddressMock }, // TODO: Remove in production
  mockEntireSchema: false, // TODO: Remove in production
  context: (): Context => ({
    models: {
      userModel,
      unconfirmedUserModel,
    },
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
