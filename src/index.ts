import express from "express";
import { expressMiddleware } from "@apollo/server/express4";
import createApolloGraphqlServer from "./graphql";
import UserService from "./services/user";

async function init() {
  const app = express();

  const POR = Number(process.env.PORT) || 3000;

  app.use(express.json());

  const gqlServer = await createApolloGraphqlServer();

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  app.use("/graphql", expressMiddleware(gqlServer, { context: async ({req}) => {
    const token = req.headers['token'];
    try {
      const user = UserService.decodeJWTToken(token as string);
      return { user };
    } catch(err) {
      return {};
    }
  }}));

  app.listen(POR, () => {
    console.log(`Server is running on port ${POR}`);
  });
}

init();
