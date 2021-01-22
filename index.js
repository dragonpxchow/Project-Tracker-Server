import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./startup/routes.js";
import productionMiddleware from "./startup/productionMiddleware.js";
import dbConnection from "./startup/dbConnection.js";

//  loads the env variables into the process.env
dotenv.config(); // from .env
dotenv.config({ path: ".env." + process.env.NODE_ENV }); // from custome env file eg: .env.development or .env.production etc

const app = express();
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
//app.use(error);

// setup all routes
routes(app);
// add production milldeware
productionMiddleware(app);

/*
app.get("/", (req, res) => {
  res.send("Hello, Welcome Project Tracker API");
});
*/

// db connection
dbConnection(app);
