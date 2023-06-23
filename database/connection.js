const { MongoClient } = require("mongodb");
// Connection URL
const url = "mongodb://localhost:27017";
const client = new MongoClient(url); //client.connect() : instantiates a new connection to a mongodb instance that runs on local host on port 27017 and returns a reference
let _db;
// Database Name
const dbName = "dbUsers";

module.exports.mongoConnected = function mongoConnected() {
  //returns a promise after connecting mongodb server to the database
  return client.connect().then((client) => {
    _db = client.db(dbName);
  });
};
module.exports.getDb = function getDb() {
  if (_db) {
    return _db;
  }
  return null;
};
//use the exported functions in server.js
