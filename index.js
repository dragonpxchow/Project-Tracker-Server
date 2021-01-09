import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./startup/routes.js";
//const error = require('../middleware/error');  implement it later

dotenv.config();
const app = express();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
//app.use(error);

// setup all routes
routes(app);
/*
app.get("/", (req, res) => {
  res.send("Hello, Welcome Project Tracker API");
});
*/
/*
// https://www.mongodb.com/cloud/atlas
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://<username>:<password>@reactcluster.4ttd3.mongodb.net/<dbname>?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});
*/
//const CONECTION_URL =
//  "mongodb+srv://tradesman-admin:littlepiggy@reactcluster.4ttd3.mongodb.net/<dbname>?retryWrites=true&w=majority";

const port = process.env.PORT || "5000";
mongoose
  .connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() =>
    app.listen(port, () => console.log(`Server running on port: ${port}`))
  )
  .catch((error) => console.log(error.message));

mongoose.set("useFindAndModify", false);