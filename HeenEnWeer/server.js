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
var Group = require('./server/app/models/group.js');
var Child = require('./server/app/models/child.js');

var hash = require('password-hash');
var passport	= require('passport');
var localStorage = require('node-localstorage').localStorage;

var PARENTS_COLLECTION = "parents";
var USERS_COLLECTION = "users";
var CHILDREN_COLLECTION = "children";
var GROUP_COLLECTION = "groups";

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

/*create sample user*/
app.get('/setup', function(req, res){
  var child1 = new Child({
    firstname: "Koen",
    lastname: "Aarschot",
    info: "Schoenmaat:34;Vriendjes:Tim,Jonas,Brent niet;"
  })

  var child2 = new Child({
    firstname: "Ella",
    lastname: "Aarschot",
    info: "Schoenmaat:34;Vriendjes:Tim,Jonas,Brent niet;"
  })

  var group1 = new Group({
    children: [],
  });

  group1.children.push(child1,child2);

  var newUser = new Users({
    email: "koen@aarschot.be",
    password: "test"
  });

  var newParent = new Parents({
    email: "jess@aarschot.be",
    firstname: "Jess",
    lastname: "Aarschot",
    group: group1,
  });

  newUser.save(function(err) {
    if (err) {
      handleError(res, err.message, "Bla");
      console.log("new user failed");
    }
  });

  newParent.save(function(err) {
    if (err) {
      handleError(res, err.message, "Bla");
      console.log("Email bestaat al");
    }
  });

  group1.save(function(err) {
    if (err) {
      handleError(res, err.message, "Email already exists.");
      console.log("Email bestaat al");
    }
  });

  child1.save(function(err) {
    if (err) {
      handleError(res, err.message, "Email already exists.");
      console.log("Email bestaat al");
    }
  });

  child2.save(function(err) {
    if (err) {
      handleError(res, err.message, "Email already exists.");
      console.log("Email bestaat al");
    }
  });

  res.json(newParent);
});

app.post('/api/signup', function(req, res) {
  if (!req.body.email || !req.body.password) {
    res.json({success: false, msg: 'Please pass email and password.'});
    console.log("fout");
  } else {
    if(!req.body.key){
      var newGroup = new Group({
        children: [],
      })
    } else {
      // zoek groep op key
      // ver newGroup = ...
      var newGroup = new Group({
        children: [],
      })
    }

    //create a new user
    var newUser = new Users({
      email: req.body.email,
      password: req.body.password
    });
    //create a new parent
    var newParent = new Parents({
      email: req.body.email,
      firstname: req.body.firstName,
      lastname: req.body.lastName,
      group: newGroup
    });
    
    console.log(newParent);
    // save the user
    newUser.save(function(err) {
      if (err) {
        handleError(res, err.message, "Email already exists.");
        console.log("Email bestaat al");
      }
      console.log("User aangemaakt");
    });

    //save the parent
    newParent.save(function(err){
      if (err){
        console.log("Nieuwe parent aanmaken niet gelukt");
      } else {
        console.log('Parent aangemaakt');
      }
        console.log('parent aangemaakt');
    });

    newGroup.save(function(err) {
      if (err) {
        handleError(res, err.message, "Group already exists");
        console.log("Groep bestaat al");
      }
    });

    res.json(newParent);
  }
});

app.post("/api/login", function(req,res){
  Users.findOne({
    email: req.body.email
  }, function(err, user) {
    if (err) throw err;
    if (!user) {
      //res.send({success: false, msg: 'Authentication failed. User not found.'});
      handleError(res, "User not found", "User doesn't exists", 400);
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
          res.json({
            email: user.email,
            password: user.password,
            token: token
          });
          console.log("User logged in");
        } else {
          handleError(res, "Wrond password", "Wrond password", 400);
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

//GET PARENTS
app.get("/api/parents", function(req, res) {
  db.collection(PARENTS_COLLECTION).find({}).toArray(function(err, parents) {
    if (err) {
      handleError(res, err.message, "Failed to get parents.");
    } else {
      res.send(parents);
    }
  });
});

//POST PARENTS
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

//GET PARENT BY EMAIL
app.get("/api/parents/:email",function(req,res){
  //virtual werkt hier niet
  Parents.findOne({email:req.params.email},function(err,user){
    res.send(JSON.stringify(user));
  })
});

//EDIT PARENTS
app.post("/api/parents/edit", function(req,res){
  //update valideert niet
  console.log("api call");
  console.log(req.body);
  Parents.findOne({
    email: req.body.email
  },function(err,parent){
    if(err)throw err;
    if(!parent){
      handleError(res, "Updating failed", "Updating failed. Could not find parent.");
    }else{
      //change attributes from parent if not undefined
      parent.firstname = req.body.firstname;
      parent.lastname = req.body.lastname;
      parent.addressStreet = req.body.addressStreet;
      parent.addressNumber = req.body.addressNumber;
      parent.addressPostalcode = req.body.addressPostalcode;
      parent.addressCity = req.body.addressCity;
      parent.telephoneNumber = req.body.telephoneNumber;
      parent.workName = req.body.workName;
      parent.workNumber = req.body.workNumber;
      parent.children = req.body.children;

      console.log(req.body);

      parent.save(function(err){
        if (err) throw err;
        res.send({success: true, msg: 'Parent updated'});
      });
    }
    });
});

app.get("/api/parent/:id", function(req, res) {

});

app.put("/api/parent/:id", function(req, res) {
});

app.delete("/api/parent/:id", function(req, res) {
});

//VOORBEELD VOOR JWT AUTHENTICATED ROUTE
app.get("/api/secret", passport.authenticate('jwt', { session: false }), function(req, res){
  res.json("Success! You can not see this without a token");
});