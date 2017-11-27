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
var moment = require('moment');

var config = require('./server/config.js');
var Users = require('./server/app/models/user.js');
var Parents = require('./server/app/models/parent.js');
var Group = require('./server/app/models/group.js');
var Child = require('./server/app/models/child.js');
var Invitee = require('./server/app/models/invitee.js');
var Event = require('./server/app/models/event.js');
var Category = require('./server/app/models/category.js');
var Costs = require("./server/app/models/cost");
var CostCategory = require("./server/app/models/costCategory");
var HeenEnWeerBoek = require('./server/app/models/HeenEnWeerBoek.js');
var HeenEnWeerDag = require('./server/app/models/HeenEnWeerDag');
var HeenEnWeerItem = require('./server/app/models/HeenEnWeerItem');
var Image = require('./server/app/models/image');

var RRule = require('rrule').RRule
var RRuleSet = require('rrule').RRuleSet
var rrulestr = require('rrule').rrulestr

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
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
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
    birthdate: new Date(),
    categories: [{
        name: "medisch",
        info: [{
          name: "Bloedgroep",
          value: "AB+"
        }]},{
        name: "persoonlijk",
        info: [{
          name: "Schoenmaat",
          value: "32"
        }]
      }]
    });

  var child2 = new Child({
    firstname: "Ella",
    lastname: "Aarschot",
    gender: "M",
    birthdate: new Date(),
    categories: [{
      name: "medisch",
      info: [{
        name: "Bloedgroep",
        value: "AB+"
      }]},{
      name: "persoonlijk",
      info: [{
        name: "Schoenmaat",
        value: "32"
      }]
    }]
  });

  var costCategory = new CostCategory({
    type: "Kostcategorie1"
  });

  var group1 = new Group({
    children: [],
    costCategories: [],
  });

  group1.children.push(child1,child2);
  group1.costCategories.push(costCategory);

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

  costCategory.save(function(err) {
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
    next(handleError(res, 'No email in body', 'Password or Email not valid', 400));
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
          next(handleError(res, "Wrong password", 400));
        }
      });
    }
  });
});

//get all the users
app.get("/api/users", passport.authenticate('jwt', { session: false }), function(req,res){
  Users.find({}, function(err,users){
    res.json(users);
  });
});

//GET PARENTS
app.get("/api/parents", passport.authenticate('jwt', { session: false }), function(req, res, next) {
  db.collection(PARENTS_COLLECTION).find({}).toArray(function(err, parents) {
    if (err) {
      next(handleError(res, err.message, "Failed to get parents."));
    } else {
      res.json(parents);
    }
  });
});

//POST PARENTS
app.post("/api/parents", passport.authenticate('jwt', { session: false }), function(req, res, next) {
  var newParent = req.body;

  if (!req.body.name) {
    next(handleError(res, "Invalid user input", "Must provide a name.", 400));
  }

  db.collection(PARENTS_COLLECTION).insertOne(newParent, function(err, parents) {
    if (err) {
      next(handleError(res, err.message, "Failed to create a new parent."));
    } else {
      res.json(parents);
    }
  });
});

//GET PARENT BY EMAIL
app.get("/api/parents/:email", passport.authenticate('jwt', { session: false }), function(req,res, next){
  //virtual werkt hier niet
  Parents.findOne({email:req.params.email},function(err,user){
    if(err){
      next(handleError(res, err.message, "could not find parent"));
    }
    console.log(user);
    res.json(user);
  }).populate({
    path: 'group',
    select:['children','events','categories','costs','costCategories','finance'],
    populate: {
      path: 'children',
      model:'Child',
      populate: {
        path: 'picture',
        model: 'Image'
      }
    }
  }).populate({
    path: 'picture',
    model: 'Image'
  });
});

//EDIT PARENTS
app.post("/api/parents/edit", passport.authenticate('jwt', { session: false }), function(req,res, next){
  //update valideert niet
  Parents.findOne({
    email: req.body.email
  },function(err,parent){
    if(err) throw err;
    if(!parent){
      next(handleError(res, "Updating failed", "Updating failed. Could not find parent."));
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
      parent.save(function(err){
        if (err) next(handleError(res, "Updating failed", "Updating failed. Could not find parent."));
        res.json(parent);
      });
    }
  });
});

// add picture to parent
app.post("/api/parents/picture/:email", passport.authenticate('jwt', {session: false}), function(req, res, next) {
  if(!req.body.filename || !req.body.filetype || !req.body.value) {
    next(handleError(res, "Filename, filetype and value must be provided"));
  } else {
    Parents.findOne({
      email: req.params.email
    }, function(err, parent) {
      if(err) {
        next(handleError(res, err.message, "Could not find parent"));
      }

      if(parent.picture) {
        Image.remove({_id: parent.picture}, function(err) {
          if(err) {
            next(handleError(res, "Could not remove image"))
          }
        });
      }

      var newImage = new Image({
        filename: req.body.filename,
        filetype: req.body.filetype,
        value: req.body.value
      });

      parent.picture = newImage;

      newImage.save(function(err) {
        if(err) {
          next(handleError(res, err.message, "Could not save picture"));
        }
      });

      parent.save(function(err) {
        if(err) {
          next(handleError(res, err.message, "Could not add picture"));
        } else {
          res.json(parent);
        }
      });
    })
  }
});


//setup
app.post("/api/setup", passport.authenticate('jwt', { session: false }), function(req,res,next){
  Parents.findOne({
    email: req.body.email
  }, function(err,parent){
    if(err){
      next(handleError(res,err.message,"Could not find parent"));
    }else{
      //type parent instellen
      var currentType = req.body.currentType;
      if(currentType != "F" && currentType != "M"){
        next(handleError(res, "Could not update parent: F/M fout parent", "Usertype does not exist. must be 'F' or 'M'", 400));
      }
      parent.type = currentType;
      //aanmaken uitgenodigde
      var invitee = new Invitee({
        email: req.body.otherEmail,
        firstname: req.body.otherFirstname,
        lastname: req.body.otherLastname,
        //linken aan groep van de huidige parent
        key: parent.group._id
      });

      //put children in an array
      var tempChildren = [];
      req.body.children.forEach(function(child){
        //if the gender is not F or M give an error
        if(child.gender != "F" && child.gender != "M"){
          next(handleError(res, "Could not update parent: F/M fout child", "Usertype does not exist. must be 'F' or 'M'", 400));
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
            next(handleError(res,err.message,"Could not save children"));
            console.log("CHILDREN SAVED");
          }
        });
        tempChildren.push(tempChild);

        //create new book
        var newBook = new HeenEnWeerBoek({
          child: tempChild
        });
        parent.group.heenEnWeerBoekjes.push(newBook);
        newBook.save(function(err){
          if(err) next(handleError(res,err.message,"Could not add a Heen en weer boekje"));
          console.log("BOEKJE ADDED");
        })

      });

      parent.group.children = tempChildren;

      parent.doneSetup = true;
      parent.save(function(err){
        if(err) next(handleError(res,err.message,"Could not update parent"));
        console.log("PARENT SAVED");
      });

      invitee.save(function(err){
        if(err) next(handleError(res,err.message,"Could not invite other parent"));
        console.log("INVITEE ADDED");
      });

      parent.group.save(function(err){
        if(err) next(handleError(res,err.message,"Could not update group"));
        console.log("GROUP SAVED");
      });

      //send a mail to the invitee
      sendMail(invitee);

      res.json("Succesfull");
    }
  }).populate({
    path: 'group',
    populate: { path: 'children' }
  });
});

//vraag invitee op adhv key
app.get("/api/invitee/:key", passport.authenticate('jwt', { session: false }), function(req,res, next){
  Invitee.findOne({
    key: req.params.key
  },function(err,invitee){
    if(err){
      next(handleError(res,err.message,"Could not find invitee"));
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
app.post("/api/invite", passport.authenticate('jwt', { session: false }), function(req,res, next){
  console.log(req.body);
  //verwijder uitgenodigde
  Invitee.findOneAndRemove({
    key : req.body.key
  },function(err,invitee){
    if(err){
      next(handleError(res,err.message,"Could not remove invitee"));
    }
  });

  Group.findOne({
    _id: req.body.key
  }, function(err, group) {
    if(err) { next(handleError(res, err.message, "Could not find group")) }

    //maak nieuwe user aan
    var newUser = new Users({
      email: req.body.email,
      password: req.body.password,
      firstname: req.body.firstname,
      lastname: req.body.lastname
    });
    //maak nieuwe parent aan
    var newParent = new Parents({
      email: req.body.email,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      group: group,
      type: req.body.gender,
      doneSetup: true
    });

    //save the user
    newUser.save(function(err){
      if(err){
        next(handleError(res, "Email bestaat al", "Email already exists."));
      }
      console.log("user aangemaakt");
    });
    //save the parent
    newParent.save(function(err){
      if(err){
        next(handleError(res, "Email bestaat al", "Email already exists."));
      }else{
        console.log("Parent aangemaakt");
      }
    });
    res.json("REGISTREERD");
  });
});

app.post("/api/children/update", passport.authenticate('jwt', { session: false }), function(req, res, next) {
  Child.findOne({
    _id: req.body._id
  }, function(err, child){
    if(err) throw err;
    if(!child){
      next(handleError(res, "Updating failed", "Updating failed. Could not find child."));
    } else{
      child.firstname = req.body.firstname;
      child.lastname = req.body.lastname;
      child.gender = req.body.gender;
      child.birthdate = req.body.birthdate;
      child.categories = req.body.categories;


      child.save(function(err){
        if (err) next(handleError(res, "Updating failed", "Updating failed. Could not find child."));
        console.log("CHILD SAVED");
        res.json(child);
      });
    }
  });
});

// add picture to child
app.post("/api/children/picture/:id", passport.authenticate('jwt', {session: false}), function(req, res, next) {
  if(!req.body.filename || !req.body.filetype || !req.body.value) {
    next(handleError(res, "Filename, filetype and value must be provided"));
  } else {
    Child.findOne({
      _id: req.params.id
    }, function(err, child) {
      if(err) {
        next(handleError(res, err.message, "Could not find Child"));
      }

      if(child.picture) {
        Image.remove({_id: child.picture}, function(err) {
          if(err) {
            next(handleError(res, "Could not remove image"))
          }
        });
      }

      var newImage = new Image({
        filename: req.body.filename,
        filetype: req.body.filetype,
        value: req.body.value
      });

      child.picture = newImage;

      newImage.save(function(err) {
        if(err) {
          next(handleError(res, err.message, "Could not save picture"));
        }
      });

      child.save(function(err) {
        if(err) {
          next(handleError(res, err.message, "Could not add picture"));
        } else {
          res.json(child);
        }
      });
    })
  }
});

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!VERANDEREN SIGNATUUR NODIG!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!toevoegen kind!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
app.post("/api/child/:id", passport.authenticate('jwt', { session: false }), function(req, res, next){
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
      var heenEnWeerBoekje = new HeenEnWeerBoek({
        child: newChild
      });
      heenEnWeerBoekje.save(function(err){
        if(err){
          next(handleError(res,"Boekje could not be added"));
        }
        console.log("BOEKJE ADDED");
      });
      group.heenEnWeerBoekjes.push(heenEnWeerBoekje);

      group.save(function(err){
        if(err){
          next(handleError(res,"An error occured"));
        }
      });

      res.json(newChild);
    });

  })
});


//fake aanmaken van een agenda om te testen, email meegeven als param
app.get("/api/calendar/setup/:email", passport.authenticate('jwt', { session: false }), function(req,res,next){
  Parents.findOne({
    email: req.params.email
  },function(err,parent){
    if(err){
      next(handleError(err,"Could not find parent"));
    }else{
      console.log(parent);
      Group.findOne({
        _id : parent.group
      },function(err,group){
        if(err){
          next(handleError(err, "Could not find group of parent"));
        }else{

          //create category
          var category = new Category({
            type: "School",
            color: "#F3F3F3"
          });
          //save category
          category.save(function(err){
            if(err){
              next(handleError(err,"Category could not be saved"));
            }
          });
          //create test event
          var event = new Event({
            title: 'Test event',
            start: new Date(),
            end: new Date(2017,10,06),
            description: 'This is a test event',
            categoryid: category,
            children: [],
          });
          event.children.push(group.children[0]);
          group.categories.push(category);
          group.events.push(event);
          event.save(function(err){
            if(err){
              next(handleError(err,"event could not be saved"));
            }
          });
          group.save(function(err){
            if(err){
              next(handleError(err,"group could not be saved"));
            }
          });
          res.send(group);
        }
      });
    }
  });
});

//get all the events from a user with categories (date, title, category color, category name)
app.get("/api/calendar/getall/:email", passport.authenticate('jwt', { session: false }), function(req,res, next){
  Parents.findOne({
    email: req.params.email
  }).populate({
    path: 'group',
    model: 'Group',
    populate:{
      path: 'events',
      model:'Events',
      populate:{
        path: 'categoryid',
        model: 'Category',
      },
    },
  }).populate({
    path: 'group',
    model: 'Group',
    populate:{
      path: 'events',
      model:'Events',
      populate:{
        path: 'children',
        model: 'Child',
      },
    },
  })
  .exec(function(err,parent){
    if(err){
      next(handleError(res, err,"parent could not be retrieved"));
    }else{
      res.json(parent.group.events.sort(function(a,b){
        return a.start > b.start;
      }));
    }
  });
});

//get one event with all the data
app.get("/api/calendar/event/:id", passport.authenticate('jwt', { session: false }), function(req,res, next){
  Event.findOne({
    _id: req.params.id
  }).populate('categoryid').exec(function(err,event){
    if(err){
      next(handleError(err));
    }else{
      res.json(event);
    }
  });
});

//get next event
app.get("/api/calendar/event/next/:email", passport.authenticate('jwt', { session: false }), function(req,res, next){

  Parents.findOne({
    email: req.params.email
  }).populate({
    path:'group',
    model:'Group',
    populate:{
      path:'events',
      model:'Events',
      select: ['title','end','start','categoryid'],
      populate:{
        path:'categoryid',
        model:'Category'
      }
    }
  }).exec(function(err,parent){
    if(err){
      next(handleError(err,"Could not retrieve events"));
    }else{
      var events = parent.group.events;
      var ev2 = events.filter(e => e.start > moment(new Date()).toDate());
      ev2.sort(function(a,b){
        return a.start > b.start;
      });
      res.json(ev2[0]);
     }
  });

});

//get events from a date
app.get("/api/calendar/event/date/:email/:date", passport.authenticate('jwt', { session: false }), function(req,res, next){
  var date = new Date(req.params.date);
  Parents.findOne({
    email: req.params.email
  }).populate({
    path:'group',
    model:'Group',
    populate:{
        path: 'events',
        model:'Events',
        select: ['title','end','start','categoryid'],
        populate:{
          path: 'categoryid',
          model: 'Category'
        }
    }
  }).exec(function(err,parent){
    if(err){
      next(handleError(err,"Could not retrieve events"));
    }
    var events = parent.group.events.filter(e =>
      e.start.getFullYear() <= date.getFullYear() && e.end.getFullYear() >= date.getFullYear()
      && e.start.getMonth() <= date.getMonth() && e.end.getMonth() >= date.getMonth()
      && e.start.getDate() <= date.getDate() && e.end.getDate() >= date.getDate())
    res.send(events.sort(function(a,b){
      return a.start > b.start;
    }));
  });
});

//wijzigen event
app.put("/api/calendar/event/edit/:id", passport.authenticate('jwt', { session: false }), function(req,res,next){
  Event.findOne({
    _id : req.params.id
  },function(err,event){
    if(err){
      next(handleError(err,"Could not retrieve event"));
    }
    event.title = req.body.title;
    event.description = req.body.description;
    event.start = req.body.start;
    event.end = req.body.end;
    event.categoryid = req.body.categoryid;
    event.save(function(err){
      if(err){
        next(handleError(err, "Could not save event"));
      }
      res.json("event saved");
    });
  });

});

//toevoegen event
app.post("/api/calendar/event/add/:email", passport.authenticate('jwt', { session: false }), function(req,res,next){
  Parents.findOne({
    email: req.params.email
  }).populate({
    path: 'group',
    model: 'Group',
    populate:{
      path: 'events',
      model:'Events',
      populate:{
        path: 'categoryid',
        model: 'Category'
      }
    }
    }).exec(function(err,parent){
      if(err){
        next(handleError(err,"Could not retrieve parent"));
      }else{
        if(req.body.freq != "" && req.body.interval){
          var freq;
          if(req.body.freq == "weekly"){
            freq = RRule.WEEKLY
          }else if(req.body.freq == "daily"){
            freq = RRule.DAILY
          }else if(req.body.freq == "monthly"){
            freq = RRule.MONTHLY
          }
          var until = new Date(req.body.until);
          var start = new Date(req.body.start);
          var end = new Date(req.body.end);
          var interval = parseInt(req.body.interval);
          var endDate = new Date(req.body.end);
          var rule = new RRule({
            freq: freq,
            //byweekday: [RRule.MO, RRule.FR],
            interval: interval,
            dtstart: start,
            until: until
          })

          for(var ev in rule.all()){
            var year = rule.all()[ev].getFullYear();
            var month = rule.all()[ev].getMonth();
            var day = rule.all()[ev].getDate();
            var hours = endDate.getHours();
            var minutes = endDate.getMinutes();
            var event = new Event({
              title: req.body.title,
              start: new Date(rule.all()[ev]),
              end: new Date(year, month, day, hours, minutes),
              description: req.body.description,
              categoryid: req.body.categoryid,
              children: req.body.children,
            });
            parent.group.events.push(event);

            //save event
            event.save(function(err){
              if(err) next(handleError(res, "Could not save event", err.message));
            });
          }
        }else{
          var event = new Event({
            title: req.body.title,
            start: req.body.start,
            end: req.body.end,
            description: req.body.description,
            categoryid: req.body.categoryid,
            children: req.body.children,
          });
          parent.group.events.push(event);

          //save event
          event.save(function(err){
            if(err) next(handleError(res, "Could not save event", err.message));
          });
        }

        parent.group.save(function(err){
          if(err){
            next(handleError(res, "Could not save group"));
          }
          else {
            res.json("event added");
          }
        })
      }
    });
});

//verwijderen event
app.delete('/api/event/delete/:email/:id', passport.authenticate('jwt', { session: false }), function (req, res, next) {

  Parents.findOne({
    email: req.params.email
  }).populate({
    path: 'group',
    model: 'Group',
    populate:{
      path: 'events',
      model:'Events'}})
      .exec(function(err,parent){
        if(err) return next(handleError(err,err.message));
        Event.findOne({
          _id : req.params.id
        },function(err,event){
          if(err) return next(handleError(err,err.message));
          var index = parent.group.events.indexOf(event);
          parent.group.events.splice(index,1);
          parent.group.save(function(err){
            if(err) return next(handleError(err,err.message));
            Event.remove({
              _id : req.params.id
            },function(err){
              if (err) return next(handleError(err,err.message));
              res.json("Event removed");
            });
          });
        });
      });
});

//toevoegen categorie
app.post("/api/category/add/:email", passport.authenticate('jwt', { session: false }), function(req,res,next){
  Parents.findOne({
    email: req.params.email
  }).populate({
    path: 'group',
    model: 'Group',
    populate:{
      path: 'categoryid',
      model: 'Category'
    }
  }).exec(function(err,parent){
    if(err){
      return next(handleError(err,err.message));
    }else{
      var category = new Category({
        type: req.body.type,
        color: req.body.color
      });
      category.save(function(err){
        if(err){
          return next(handleError(err,err.message));
        }
        var group = parent.group;
        group.categories.push(category);
        group.save(function(err){
          if(err){
            return next(handleError(err,err.message));
          }
        });
        res.json(category);
      });
    }
  });
});

//get all categories of user
app.get("/api/category/:email", passport.authenticate('jwt', { session: false }), function(req,res,next){
  Parents.findOne({
    email: req.params.email
  }).populate({
    path:'group',
    model:'Group',
    populate:{
      path:'categories',
      model:'Category'
    }
  }).exec(function(err,parent){
    if(err){
      next(handleError(res, "Could not retrieve parent"));
    }else{
      res.json(parent.group.categories);
    }
  });
});

// Add financial information
app.post("/api/finance", passport.authenticate('jwt', { session: false }), function(req, res, next) {
  console.log(req.body);

  Parents.findOne({
    group: req.body._id
  }).populate({
    path: 'group',
    model: 'Group'
  })
  .exec(function(err, parent) {
    if(err || !parent) {
      next(handleError(res, err.message));
    } else {
      newFinType = {
        fintype: req.body.finance.fintype,
        accepted: req.body.finance.accepted,
        kindrekening: null,
        onderhoudsbijdrage: null
      }

      if (req.body.finance.fintype === 'kindrekening' && req.body.finance.kindrekening.maxBedrag !== 0) {
        newFinType.kindrekening = {
          maxBedrag: req.body.finance.kindrekening.maxBedrag
        }
      } else if (req.body.finance.fintype === 'onderhoudsbijdrage'){
        newFinType.onderhoudsbijdrage = {
          onderhoudsgerechtigde: req.body.finance.onderhoudsbijdrage.onderhoudsgerechtigde,
          onderhoudsplichtige: req.body.finance.onderhoudsbijdrage.onderhoudsplichtige,
          percentage: req.body.finance.onderhoudsbijdrage.percentage
        }
      }

      parent.group.finance = newFinType;

      parent.group.save(function(err) {
        if(err) {
          handleError(res, 'Error while saving group');
        } else {
          console.log("Saving group");
        }
      });

      parent.save(function(err) {
        if(err) {
          next(handleError(res, 'Error while saving parent'));
        } else {
          console.log("Saving parent");
          res.json(parent.group);
        }
      });
    }
  });
});

// Accept finance info other parent
app.post("/api/finance/accept", passport.authenticate('jwt', { session: false }), function(req, res, next) {
  console.log(req.body);

  Parents.findOne({
    email: req.body.email
  }).populate({
    path: 'group',
    model: 'Group'
  }).exec(function(err, parent) {
    parent.group.finance.accepted.push(parent.id);
    parent.group.finance.accepted = parent.group.finance.accepted.filter(function(n){ return (n != undefined && n != null)});

    parent.group.save(function(err) {
      if(err) { next(handleError(res, err.message)) }
      else {
        res.json("Accepted succesful");
      }
    });
  });
});

//get all costs of user
app.get("/api/costs/:email", passport.authenticate('jwt', { session: false }), function(req,res,next){
  Parents.findOne({
    email: req.params.email
  }).populate({
    path:'group',
    model:'Group',
    populate:{
      path:'costs',
      model:'Costs',
      populate: {
        path: 'costCategoryid',
        model: 'CostCategory'
      },
      populate: {
        path: 'picture',
        model: 'Image'
      }
    }
  }).exec(function(err,parent){
    if(err){
      next(handleError(res, err.message, "could not get costs"));
    }else{
      res.json(parent.group.costs);
    }
  });
});

//toevoegen kost
app.post("/api/costs/addCost/:email", passport.authenticate('jwt', { session: false }), function(req,res,next){
  Parents.findOne({
    email: req.params.email
  }).populate({
    path: 'group',
    model: 'Group',
    populate:{
      path: 'costs',
      model: 'Costs',
      populate: {
        path: 'costCategoryid',
        model: 'CostCategory'
      }
    }
  }).exec(function(err,parent){
    console.log(req.body);

    if(err){
      next(handleError(res, err.message));
    }else{
<<<<<<< HEAD
      if(req.body.filename && req.body.filetype && req.body.value) {
=======
      if(req.body.filename || req.body.filetype || req.body.value) {
>>>>>>> d6adf8a18b926847b963c311dcbd7a2358323a5a
        var newImage = new Image({
          filename: req.body.picture.filename,
          filetype: req.body.picture.filetype,
          value: req.body.picture.value
        });

        newImage.save(function(err) {
          if(err) {
            next(handleError(res, err.message, "Could not save picture"));
          }
        });

        var cost = new Costs({
          title: req.body.title,
          description: req.body.description,
          amount: req.body.amount,
          date: req.body.date,
          costCategoryid: req.body.costCategoryid,
          picture: newImage
        });
      } else {
        var cost = new Costs({
          title: req.body.title,
          description: req.body.description,
          amount: req.body.amount,
          date: req.body.date,
          costCategoryid: req.body.costCategoryid
        });
      }

      cost.save(function(err){
        if(err){
          next(handleError(res, err.message));
        }
      });
      var group = parent.group;
      group.costs.push(cost);
      group.save(function(err){
        if(err){
          next(handleError(res, 'Category could not be added', err.message));
        }
      });
      res.json(cost);
    }
  });
});

//toevoegen kostCategorie
app.post("/api/costs/addCategory/:email", passport.authenticate('jwt', { session: false }), function(req,res,next){
  Parents.findOne({
    email: req.params.email
  }).populate({
    path: 'group',
    model: 'Group',
    populate:{
      path: 'costCategories',
      model: 'CostCategory'
    }
  }).exec(function(err,parent){
    if(err){
      next(handleError(res, "parent could not be retrieved", err.message));
    }else{
      var category = new CostCategory({
        type: req.body.type,
      });
      category.save(function(err){
        if(err){
          next(handleError(res, err.message));
        }
      });
      var group = parent.group;
      group.costCategories.push(category);
      //group.costs.costCategory = category;
      group.save(function(err){
        if(err){
          next(handleError(res, 'Category could not be added', err.message));
        }
      });
      res.json(category);
    }
  });
});

//get all costCategories
app.get("/api/costs/categories/:email", passport.authenticate('jwt', { session: false }), function(req,res,next){
  Parents.findOne({
    email: req.params.email
  }).populate({
    path:'group',
    model:'Group',
    populate:{
      path:'costCategories',
      model:'CostCategory',
    }
  }).exec(function(err,parent){
    if(err){
      next(handleError(res, "Could not retrieve parent", err.message));
    }else{
      res.json(parent.group.costCategories);
    }
  });
});

//toevoegen heen en weerdag
app.post("/api/heenenweer/day/add", passport.authenticate('jwt', { session: false }), function(req,res,next){
  HeenEnWeerBoek.findOne({
    child: req.body.child._id
  },function(err,boek){
    if(err) next(handleError(res,err.message,"Could not find book"));
    var day = new HeenEnWeerDag({
      date: req.body.date,
      child: req.body.child,
      description: req.body.description
    });
    boek.days.push(day);
    day.save(function(err){
      if(err){
        next(handleError(res,err.message,"Could not save day"));
      }else{
        boek.save(function(err){
          if(err) next(handleError(res,err.message,"Could not save book"));
          console.log("book saved");
          res.json("Day added");
        });
      }
    })
  });
})

//toevoegen heen en weer item
app.post("/api/heenenweer/item/add/:dayid", passport.authenticate('jwt', { session: false }), function(req,res,next){
  HeenEnWeerDag.findOne({
    _id: req.params.dayid
  },function(err,day){
    if(err) next(handleError(res,err.message,"Could not retrieve day"));

    var newItem = new HeenEnWeerItem({
      category: req.body.category,
      value: req.body.value
    });
    day.items.push(newItem);
    newItem.save(function(err){
      if(err)next(handleError(res,err.message,"Could not save new item"));
        day.save(function(err){
          if(err)next(handleError(res,err.message,"Could not save day"));
          console.log("ITEM ADDED");
          res.json("successfully added item");
        })
    })
  });
});

//opvragen alle boekjes met datum dagen en beschrijvenen en kind
app.get("/api/heenenweer/getAll/:email", passport.authenticate('jwt', { session: false }), function(req,res,next){
  Parents.findOne({
    email: req.params.email
  }).populate({
    path:'group',
    model:'Group',
    populate:{
      path:'heenEnWeerBoekjes',
      model:'HeenEnWeerBoek',
      populate:[
        {
          path:'child',
          model:'Child',
          select:['firstname','lastname']
        },
        {
          path:'days',
          model:'HeenEnWeerDag',
          select:['child','description','date'],
          populate:{
            path:'child',
            model:'Child',
            select: ['firstname']
          }
        }
      ]
    }
  }).exec(function(err,parent){
    if(err) next(handleError(res,err.message,"Could not retrieve parent"));
    console.log(parent.group.heenEnWeerBoekjes);
    res.json(parent.group.heenEnWeerBoekjes);
  })

});

//opvragen informatie heen en weer voor bepaalde dag
app.get("/api/heenenweer/day/:id", passport.authenticate('jwt', { session: false }), function(req,res,next){
 HeenEnWeerDag.findOne({
   _id: req.params.id
 }).populate([
   {
     path:'child',
     model:'Child',
     select:['firstname','lastname']
   },
   {
     path:'items',
     model:'HeenEnWeerItem',
     populate:{
       path:'category',
       model:'Category'
     }
   }
 ]).exec(function(err,day){
   if(err)next(handleError(res,err.message,"Could not find day"));
   res.json(day);
 })
});

//edit heenenweer item
app.put("/api/heenenweer/item/edit/:id",function(req,res,next){
  HeenEnWeerItem.findOne({
    _id: req.params.id
  },function(err,item){
    if(err)next(handleError(res,err.message,"Could not find item"));
    item.category = req.body.category;
    item.value = req.body.value;
    item.save(function(err){
      if(err)next(handleError(res,err.message,"Could not save item"));
      res.json("Item saved");
    })
  });

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
