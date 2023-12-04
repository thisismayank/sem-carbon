import express from "express";
import userRoutes from "./user.route";
import carbonRoutes from "./carbon.route";
import plaidRoutes from "./plaid.route"
import openaiRoutes from "./openai.route"



const v1Router = express.Router();

v1Router.use("/users", userRoutes);
v1Router.use("/carbon", carbonRoutes);
v1Router.use("/plaids", plaidRoutes);
v1Router.use("/chats", openaiRoutes);



export default v1Router;
