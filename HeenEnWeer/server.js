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
var Users = require('./server/app/models/user.js');
var Parents = require('./server/app/models/parent.js');
var hash = require('password-hash');
var passport	= require('passport');
var localStorage = require('node-localstorage').localStorage;



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
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
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

app.post('/api/signup', function(req, res) {
  if (!req.body.email || !req.body.password) {
    res.json({success: false, msg: 'Please pass email and password.'});
    console.log("fout");
  } else {
    //create a new user
    var newUser = new Users({
      email: req.body.email,
      password: req.body.password
    });
    //create a new parent
    var newParent = new Parents({
      email: req.body.email,
      firstname: req.body.firstName,
      lastname: req.body.lastName

    });
    console.log(newParent);
    // save the user
    newUser.save(function(err) {
      if (err) {
        return res.json({success: false, msg: 'Email already exists.'});
        console.log("email bestaat al");
      }
        res.json({success: true, msg: 'Successful created new user.'});
        console.log("user aangemaakt");


    });

    //save the parent
    newParent.save(function(err){
      if (err){
        console.log("nieuwe parent aanmaken niet gelukt");
      }
        console.log('parent aangemaakt');


    });
  }
});

app.post("/api/login", function(req,res){
  Users.findOne({
    email: req.body.email
  }, function(err, user) {
    if (err) throw err;
    if (!user) {
      res.send({success: false, msg: 'Authentication failed. User not found.'});
    } else {
      // check if password matches
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          var token = jwt.encode(user, config.secret);
          if (typeof localStorage === "undefined" || localStorage === null) {
            var LocalStorage = require('node-localstorage').LocalStorage;
            localStorage = new LocalStorage('./scratch');
          }
          localStorage.setItem('currentUser', user)
          console.log(user);
          res.json({
            email: user.email,
            password: user.password,
            token: token
          });
        } else {
          res.send({success: false, msg: 'Authentication failed. Wrong password.'});
        }
      });
    }
  });
});

app.get("/api/users", function(req,res){
  Users.find({}, function(err,users){
    res.send(JSON.stringify(users));
  });
});


app.get("/api/parents/:email",function(req,res){
  //virtual werkt hier niet
  Parents.find({_id:req.params.email},function(err,user){
    res.send(JSON.stringify(user));
  })
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
