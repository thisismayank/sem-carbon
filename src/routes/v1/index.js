import express from "express";
import userRoutes from "./user.route";
import carbonRoutes from "./carbon.route";


const v1Router = express.Router();

v1Router.use("/users", userRoutes);
v1Router.use("/carbon", carbonRoutes);


export default v1Router;
