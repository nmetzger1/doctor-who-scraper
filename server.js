// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");

// Requiring Article models
var Article = require("./models/articles.js");

// Scraping tools
var request = require("request");
var cheerio = require("cheerio");
// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;


// Initialize Express
var app = express();
var PORT = process.env.PORT || 3000;


// Use body parser with our app
app.use(bodyParser.urlencoded({
    extended: false
}));

//Handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Make public a static dir
app.use(express.static("public"));

// Database configuration with mongoose
mongoose.connect("mongodb://heroku_z9168dkj:9atl3qs3jt1qg8pg7ub00sfl60@ds147681.mlab.com:47681/heroku_z9168dkj");
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
    console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
    console.log("Mongoose connection successful.");
});

//API Routes
require("./routes/api-routes.js")(app);

// Listen on port 3000
app.listen(PORT, function() {
    console.log("App running on port 3000!");
});