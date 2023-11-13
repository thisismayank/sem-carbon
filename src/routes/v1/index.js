import express from "express";
import userRoutes from "./user.route";

const v1Router = express.Router();

v1Router.use("/users", userRoutes);

export default v1Router;
