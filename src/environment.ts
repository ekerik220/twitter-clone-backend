const defaultPort = 4000;

interface Environment {
  apollo: {
    introspection: boolean;
    playground: boolean;
  };
  mongoDB: {
    url: string;
  };
  port: number | string;
}

export const environment: Environment = {
  apollo: {
    introspection: process.env.APOLLO_INTROSPECTION === "true",
    playground: process.env.APOLLO_PLAYGROUND === "true",
  },
  mongoDB: {
    url: process.env.MONGO_DB_URL as string,
  },
  port: process.env.PORT || defaultPort,
};
