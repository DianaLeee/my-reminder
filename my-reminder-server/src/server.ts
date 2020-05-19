// createConnection()
//   .then(async (connection) => {
//     console.log("Inserting a new user into the database...");
//     const user = new User();
//     user.firstName = "Timber";
//     user.lastName = "Saw";
//     user.age = 25;
//     await connection.manager.save(user);
//     console.log("Saved a new user with id: " + user.id);

//     console.log("Loading users from the database...");
//     const users = await connection.manager.find(User);
//     console.log("Loaded users: ", users);

//     console.log("Here you can setup and run express/koa/any other framework.");
//   })
//   .catch((error) => console.log(error));

import Koa from "koa";
import Router from "koa-router";
import bodyParser from "koa-bodyparser";
import cors from "koa-cors2";
import { config } from "./config";

import { createConnection } from "typeorm";
import "reflect-metadata";

import { api } from "./api";
const { jwtMiddleware } = require("./lib/token");

const initServer = async () => {
  await createConnection()
    .then(async (connection) => {
      const app = new Koa();
      const router = new Router();

      router.use("/api", api.routes());

      // Using middlewares
      app.use(cors());
      app.use(bodyParser()); // route 코드보다 상단에 있어야함
      app.use(jwtMiddleware);
      app.use(router.routes());
      app.use(router.allowedMethods());

      app.listen(config.port, () => {
        console.log(`Server is running on port ${config.port}`);
      });
    })
    .catch((error) => console.log(error));
};

initServer();
