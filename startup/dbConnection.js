import mongoose from "mongoose";

const dbConnection = (app) => {
  console.log("Node server environment variables:", process.env.NODE_ENV);
  console.log(
    "REACT_APP_MONGO_DB_USER >>>>>>",
    process.env.REACT_APP_MONGO_DB_USER
  );
  console.log(
    "REACT_APP_MONGO_DB_PASSWORD >>>>>",
    process.env.REACT_APP_MONGO_DB_PASSWORD
  );

  process.env.CONNECTION_URL =
    "mongodb+srv://" +
    process.env.REACT_APP_MONGO_DB_USER +
    ":" +
    process.env.REACT_APP_MONGO_DB_PASSWORD +
    "@reactcluster.4ttd3.mongodb.net/project-tracker?retryWrites=true&w=majority";
  const port = process.env.PORT || "5000";
  console.log(
    "Project tracker running on port '" +
      port +
      "' with mongo connction url:  " +
      process.env.CONNECTION_URL
  );

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
};

export default dbConnection;
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
