import { ApolloServer } from "apollo-server";
import mongoose from "mongoose";
import { environment } from "./environment";
import { typeDefs, resolvers } from "./graphql";
import { DateTimeMock, EmailAddressMock } from "graphql-scalars";

import userModel from "./mongodb/userModel";

export interface Context {
  models: {
    userModel: mongoose.Model<mongoose.Document, {}>;
  };
}

// Set up server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: environment.apollo.introspection,
  playground: environment.apollo.playground,
  mocks: { DateTime: DateTimeMock, EmailAddress: EmailAddressMock }, // TODO: Remove in production
  mockEntireSchema: false, // TODO: Remove in production
  context: (): Context => ({
    models: {
      userModel,
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
