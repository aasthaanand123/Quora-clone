const express = require("express");
const PORT = 2222;
const path = require("path");
const hbs = require("hbs");

//function to connect node server with mongodb database
const { mongoConnected } = require("./database/connection");
const bodyParser = require("body-parser");
//import router
const router = require("./routes/app");
//instance of server
const app = express();
//when node server is connected with db, then start the server on the port
mongoConnected().then(() => {
  //start server
  app.listen(PORT, () => {
    console.log(`server is started at http://localhost:${PORT}`);
  });
});
//after server is started establish various routes
//middlewares
//for delivering requested static files
app.set("view engine", "hbs");
hbs.registerPartials(path.join(__dirname, "views", "partials"));
app.use(express.static(path.join(__dirname, "public")));
//for parsing data to json(express.json or bodyParser.json())
app.use(express.json());
//for parsing form data(url-form-encoded data)
app.use(express.urlencoded({ extended: true }));
//use routes
//for all routes
app.use(router);
