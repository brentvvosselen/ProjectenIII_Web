var express = require("express");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var PARENTS_COLLECTION = "parents";

var app = express();
app.use(bodyParser.json());

// Resolves the Access-Control-Allow-Origin error in the console
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


// Create link to Angular build directory
var distDir = __dirname + "/dist/";
app.use(express.static(distDir));

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;

// Connect to the database before starting the application server.
mongodb.MongoClient.connect("mongodb://localhost:27017/heenenweer", function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = database;
  console.log("Database connection ready");

  // Initialize the app.
  var server = app.listen(process.env.PORT || 5000, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});

// CONTACTS API ROUTES BELOW

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

app.get("/api/parents", function(req, res) {
  db.collection(PARENTS_COLLECTION).find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get parents.");
    } else {
      res.status(200).json(docs);
    }
  });
});

app.post("/api/parents", function(req, res) {
  var newParent = req.body;

  if (!req.body.name) {
    handleError(res, "Invalid user input", "Must provide a name.", 400);
  }

  db.collection(PARENTS_COLLECTION).insertOne(newParent, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to create new parent.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
});

/*  "/api/contacts/:id"
 *    GET: find parents by id
 *    PUT: update parents by id
 *    DELETE: deletes parents by id
 */

app.get("/api/parent/:id", function(req, res) {
});

app.put("/api/parent/:id", function(req, res) {
});

app.delete("/api/parent/:id", function(req, res) {
});
