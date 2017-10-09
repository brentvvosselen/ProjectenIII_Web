// =======================
// get the packages we need ============
// =======================

var express = require("express");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;
var mongoose = require('mongoose');
var jwt = require('jwt-simple');
var morgan = require("morgan");
var config = require('./server/config.js');
var User = require('./server/app/models/user.js');
var hash = require('password-hash');
var passport	= require('passport');


var PARENTS_COLLECTION = "parents";
var USERS_COLLECTION = "users";

var app = express();
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());
app.use(passport.initialize());

// connect to database
mongoose.connect(config.database);

// pass passport for configuration
require('./server/config/passport')(passport);

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
      handleError(res, err.message, "Failed to create a new parent.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
});


/*create sample user*/
app.get('/setup', function(req, res){
  var nick = new User({
    email: 'nick_Lippens@hotmail.com',
    password: 'password1'
  });

  db.collection(USERS_COLLECTION).insertOne(nick, function(err,doc){
    if(err){
      handleError(res, err.message, "Failed to create a new user.");
    }
    console.log('User saved successfully');
    res.json({success:true});
  });
});

app.post("/api/register", function(req,res){
  var newUser = req.body;
  newUser.password = hash.generate(newUser.password);

  if(!req.body.email || !req.body.password){
    res.status(400).send('Incomplete form.');
    //handleError(res,"Invalid user input", "Must provide a name and a password.",400);
  }

  db.collection(USERS_COLLECTION).findOne({email: newUser.email},function(err, existingUser){
    if (err){
      res.status(400).send(err);
      //handleError(res, err.message, "Failed to create a new user.", 400);
    } else{
      if (existingUser){
        res.status(400).send('User already exists.');
        //handleError(res, "User already exists", "Use an email that hasn't been used.", 400);
        return false;
      } else{
        temp = {
          email: newUser.email,
          password: newUser.password
        }

        db.collection(USERS_COLLECTION).insertOne(temp,function(err,doc){
          if (err){
            handleError(res,err.message,"Failed to create a new user.", 400);
          } else{
            res.status(201).json(doc.ops[0]);
          }
        });
      }
    }
  });
});

app.post('/api/signup', function(req, res) {
  if (!req.body.email || !req.body.password) {
    res.json({success: false, msg: 'Please pass email and password.'});
  } else {
    var newUser = new User({
      email: req.body.email,
      password: req.body.password
    });
    // save the user
    newUser.save(function(err) {
      if (err) {
        return res.json({success: false, msg: 'Username already exists.'});
      }
      res.json({success: true, msg: 'Successful created new user.'});
    });
  }
});

app.post("/api/login", function(req,res){

  User.findOne({
    email: req.body.email
  }, function(err, user) {
    if (err) throw err;
 
    if (!user) {
      res.send({success: false, msg: 'Authentication failed. User not found.'});
    } else {
      // check if password matches
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          var token = jwt.encode(user, config.secret);
          // return the information including token as JSON
          res.json({success: true, token: 'JWT ' + token});
        } else {
          res.send({success: false, msg: 'Authentication failed. Wrong password.'});
        }
      });
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
