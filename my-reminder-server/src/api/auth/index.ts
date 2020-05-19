import Router from "koa-router";

const auth = new Router();
const authController = require("./auth.controller");

auth.post("/login", authController.login);
auth.post("/logout", authController.logout);
auth.post("/register", authController.register);
auth.get("/exist/:email", authController.exist);
auth.get("/check", authController.check);

export default auth;
