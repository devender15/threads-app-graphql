import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";

async function init() {
  const app = express();

  const POR = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // create graphql server
  const gqlServer = new ApolloServer({
    typeDefs: `
    type Query {
        hello: String
        say(name: String): String
    }
    `,
    resolvers: {
      Query: {
        hello: () => "Hello World!",
        say: (_, { name }: { name: string }) => `hey ${name}`,
      },
    },
  });

  await gqlServer.start();

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  app.use("/graphql", expressMiddleware(gqlServer));

  app.listen(POR, () => {
    console.log(`Server is running on port ${POR}`);
  });
}

init();
