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
var hash = require('password-hash');
var passport	= require('passport');
var localStorage = require('node-localstorage').localStorage;

var config = require('./server/config.js');
var Users = require('./server/app/models/user.js');
var Parents = require('./server/app/models/parent.js');
var Group = require('./server/app/models/group.js');
var Child = require('./server/app/models/child.js');
var Invitee = require('./server/app/models/invitee.js');

var PARENTS_COLLECTION = "parents";
var USERS_COLLECTION = "users";
var CHILDREN_COLLECTION = "children";
var GROUP_COLLECTION = "groups";

var nodemailer = require('nodemailer');
var transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'oogappl@gmail.com',
      pass: 'ABC111111'
    },
    debug: true,
  });

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
    gender: "M",
    birthdate: 4,
    categories: {
      name: "medisch",
      info: [{
        name: "Schoenmaat",
        value: "32"
      }, {
        name: "Bloedgroep",
        value: "AB+"
      }]
    }
  });

  var child2 = new Child({
    firstname: "Ella",
    lastname: "Aarschot",
    gender: "M",
    birthdate: 6,
    categories: {
      name: "medisch",
      info: [{
        name: "Schoenmaat",
        value: "32"
      }, {
        name: "Bloedgroep",
        value: "A-"
      }]
    }
  });

  var group1 = new Group({
    children: [],
  });

  group1.children.push(child1,child2);

  var newUser = new Users({
    firstname: "jess",
    lastname: "aarschot",
    email: "jess@aarschot.be",
    password: "test"
  });

  var newParent = new Parents({
    type: "M",    
    email: "jess@aarschot.be",
    firstname: "Jess",
    lastname: "Aarschot",
    group: group1,
    doneSetup: true,

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

//register with our app
app.post('/api/signup', function(req, res, next) {
  if (!req.body.email || !req.body.password) {
    handleError(res, 'No email in body', 'Password or Email not valid', 400);
  } else {
    //create a new group for sharing childinfo
    var newGroup = new Group({
      children: [],
    });

    //create a new user for authentication
    var newUser = new Users({
      email: req.body.email,
      password: req.body.password,
      firstname: req.body.firstName,
      lastname: req.body.lastName
    });

    //create a new parent for saving all the info
    var newParent = new Parents({
      email: req.body.email,
      firstname: req.body.firstName,
      lastname: req.body.lastName,
      group: newGroup,
      doneSetup: false,
    });

    //check is user exists based on email
    Users.findOne({email:req.body.email},function(err,user){
      //if user does not exist, save all the documents
      if(!user){
        newUser.save(function(err) {
          if (err) {
            next(handleError(res, "Email already exists."));
          }
          newGroup.save(function(err) {
            if (err) {
              next(handleError(res, "Group already exists"));
            }
          });
          //save the parent
          newParent.save(function(err){
            if (err){
              next(handleError(res, "Group already exists"));
            }
          });
          res.send(newUser);
        });
      }else{
        next(handleError(res,"User already exists"));
      }
    });
  }
});

//login with in our app and get a token
app.post("/api/login", function(req,res, next){
  Users.findOne({
    email: req.body.email
  }, function(err, user) {
    if (err) throw err;
    if (!user) {
      next(handleError(res, "User doesn't exists", 400));
    } else {
      // check if password matches with password in the database
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          //issue a token if passwords match
          var token = jwt.encode(user, config.secret);

          //response with token and email
          res.json({
            email: user.email,
            //password: user.password
            firstname: user.firstname,
            lastname: user.lastname,
            token: token
          });
          console.log("User logged in");
        } else {
          handleError(res, "Wrong password", 400);
        }
      });
    }
  });
});

//get all the users
app.get("/api/users", function(req,res){
  Users.find({}, function(err,users){
    res.json(users);
  });
});

//GET PARENTS
app.get("/api/parents", function(req, res) {
  db.collection(PARENTS_COLLECTION).find({}).toArray(function(err, parents) {
    if (err) {
      handleError(res, err.message, "Failed to get parents.");
    } else {
      res.json(parents);
    }
  });
});

//POST PARENTS
app.post("/api/parents", function(req, res) {
  var newParent = req.body;

  if (!req.body.name) {
    handleError(res, "Invalid user input", "Must provide a name.", 400);
  }

  db.collection(PARENTS_COLLECTION).insertOne(newParent, function(err, parents) {
    if (err) {
      handleError(res, err.message, "Failed to create a new parent.");
    } else {
      res.json(parents);
    }
  });
});

//GET PARENT BY EMAIL
app.get("/api/parents/:email",function(req,res){
  //virtual werkt hier niet
  Parents.findOne({email:req.params.email},function(err,user){
    if(err){
      handleError(res, err.message, "could not find parent");
    }
    console.log(user);
    res.json(user);
  }).populate({
    path: 'group',
    populate: { path: 'children' }
  });
});

//EDIT PARENTS
app.post("/api/parents/edit", function(req,res){
  //update valideert niet

  Parents.findOne({
    email: req.body.email
  },function(err,parent){
    if(err) throw err;
    if(!parent){
      handleError(res, "Updating failed", "Updating failed. Could not find parent.");
    }else{

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
      parent.type = req.body.type;

      //console.log(parent);
      console.log("telefoonnummer"+parent.telephoneNumber);

      parent.save(function(err){
        if (err) throw err;
        console.log("PARENT SAVED");
        console.log(parent.telephoneNumber);
        res.json(parent);
      });
    }
  });
});


//setup
app.post("/api/setup", function(req,res){
  Parents.findOne({
    email: req.body.email
  }, function(err,parent){
    if(err){
      handleError(res,err.message,"Could not find parent");
    }else{
      //type parent instellen
      var currentType = req.body.currentType;
      if(currentType != "F" && currentType != "M"){
        handleError(res, "Could not update parent: F/M fout parent", "Usertype does not exist. must be 'F' or 'M'", 400);
      }
      parent.type = currentType;
      //aanmaken uitgenodigde
      var invitee = new Invitee({
        email: req.body.otherEmail,
        firstname: req.body.otherFirstname,
        lastname: req.body.otherLastname,
        //linken aan groep van de huidige parent
        key: parent.group
      });

      //put children in an array
      var children = [];
      req.body.children.forEach(function(child){
        //if the gender is not F or M give an error
        if(child.gender != "F" && child.gender != "M"){
          handleError(res, "Could not update parent: F/M fout child", "Usertype does not exist. must be 'F' or 'M'", 400);
        }
        var tempChild = new Child({
          firstname: child.firstname,
          lastname: child.lastname,
          gender: child.gender,
          birthdate: child.birthdate
        })
        //save each child to db
        tempChild.save(function(err){
          if(err){
            handleErr(res,err.message,"Could not save children");
            console.log("CHILDREN SAVED");
          }
        });
        children.push(tempChild);
      });

      //find group of parent and add children to the group
      Group.findOne({
        _id: parent.group
      },function(err,group){
        if(err){
          handleErr(res,err.message,"Could not find group");
        }else{
          //there are no children in db before setup
          group.children = children;
          //save the group to the db
          group.save(function(err){
            if(err)
            handleError(res,err.message,"Could not add children to group");
            console.log("CHILDREN ADDED");
          });
        }
      });

      parent.doneSetup = true;
      parent.save(function(err){
        if(err)
        handleError(res,err.message,"Could not update parent");
        console.log("PARENT SAVED");
      });

      invitee.save(function(err){
        if(err)
        handleError(res,err.message,"Could not invite other parent");
        console.log("INVITEE ADDED");
      });

      //send a mail to the invitee
      sendMail(invitee);

      res.json("SETUP COMPLETE");
    }
  });
});

//vraag invitee op adhv key
app.get("/api/invitee/:key",function(req,res){
  Invitee.findOne({
    key: req.params.key
  },function(err,invitee){
    if(err){
      handleError(res,err.message,"Could not find invitee");
    }else{
      res.json(invitee);
    }
  });
});

/**
 * Eerst de Invitee verwijderen uit de databank,
 * een nieuwe user aanmaken, met een nieuwe parent met alle values
 * groep aan parent toevoegen
 */
app.post("/api/invite",function(req,res){
  console.log(req.body);
  //verwijder uitgenodigde
  Invitee.findOneAndRemove({
    key : req.body.key
  },function(err,res){
    if(err){
      handleError(res,err.message,"Could not remove invitee");
    }
  });
  //maak nieuwe user aan
  var newUser = new Users({
    email: req.body.email,
    password: req.body.password
  });
  //maak nieuwe parent aan
  var newParent = new Parents({
    email: req.body.email,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    group: req.body.key,
    type: req.body.gender
  });
  //save the user
  newUser.save(function(err){
    if(err){
      handleError(res, "Email bestaat al", "Email already exists.");
    }
    console.log("user aangemaakt");
  });
  //save the parent
  newParent.save(function(err){
    if(err){
      console.log("Nieuwe parent aanmaken niet gelukt");
    }else{
      console.log("Parent aangemaakt");
    }
  });
  res.json("REGISTREERD");
});

app.post("/api/children/update", function(req, res) {
  Child.findOne({
    _id: req.body._id
  }, function(err, child){
    if(err) throw err;
    if(!child){
      handleError(res, "Updating failed", "Updating failed. Could not find child.");
    } else{
      child.firstname = req.body.firstname;
      child.lastname = req.body.lastname;
      child.gender = req.body.gender;
      child.birthdate = req.body.birthdate;
      child.categories = req.body.categories;


      child.save(function(err){
        if (err) throw err;
        console.log("CHILD SAVED");
        res.json(child);
      });
    }
  });
});

app.post("/api/child/:id", function(req, res, next){
  console.log(req.params.id);
  Parents.findOne({
    _id : req.params.id
    }, function(err,parent){
    console.log(parent);
    if(err){
      next(handleError(res, "Parent does not exist"));
    }
    console.log(parent.group);
    Group.findOne({
      _id: parent.group
    }, function(err, group){
      if(err){
        next(handleError(res, "Group does not exist"));
      }
      //console.log(req.body);
      var newChild = new Child({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        gender: req.body.gender,
        birthdate: req.body.birthdate,
      });

      console.log(newChild);

      newChild.save(function(err){
        if(err){
          next(handleError(res, "Child already exists"));
        }
      });
      
      group.children.push(newChild);

      group.save(function(err){
        if(err){
          next(handleError(res,"An error occured"));
        }
      });

      res.json("succes");
    });
    
  })
});

//VOORBEELD VOOR JWT AUTHENTICATED ROUTE
app.get("/api/secret", passport.authenticate('jwt', { session: false }), function(req, res){
  res.json("Success! You can not see this without a token");
});

function sendMail(invitee){
  var text = "Hallo, beste " + invitee.firstname + " " + invitee.lastname +
  " U werd uitgenodigd om samen te werken via OOGAPPL.";
  var htmlString = '<h1>Hallo</h1><h4>Beste ' + invitee.firstname +
  " " + invitee.lastname + '</h4><p>U werd uitgenodigd om samen te werken via OOGAPPL.</p><a href="http://localhost:4200/register/invite/'
  + invitee.key +'">Klik hier om te beginnen.</a>';
  var mailOptions = {
    from: 'oogappl@gmail.com',
    to: invitee.email,
    subject: 'Uitnodiging tot OOGAPPL.',
    text: text,
    html: htmlString
  };

  transport.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err);
    }
  });

}
