const defaultPort = 4000;

interface Environment {
  apollo: {
    introspection: boolean;
    playground: boolean;
  };
  mongoDB: {
    url: string;
  };
  homepage: string;
  port: number | string;
  jwtSecret: string;
  email: {
    username: string;
    password: string;
  };
}

export const environment: Environment = {
  apollo: {
    introspection: process.env.APOLLO_INTROSPECTION === "true",
    playground: process.env.APOLLO_PLAYGROUND === "true",
  },
  mongoDB: {
    url: process.env.MONGO_DB_URL as string,
  },
  homepage: process.env.HOME_PAGE as string,
  port: process.env.PORT || defaultPort,
  jwtSecret: process.env.JWT_SECRET as string,
  email: {
    username: process.env.EMAIL as string,
    password: process.env.EMAIL_PASS as string,
  },
};
