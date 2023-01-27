---
title: "Secure endpoints in ExpressJS with PassportJS and MongoDB"
description: "Example of an express server with authentication and authorization using JWT token and permission levels"
date: "2023-01-26"
categories: ["ExpressJS", "NodeJS", "PassportJS"]
tags: ["server", "tutorial"]
---

In this post we're going to learn how to secure endpoints using [Express.js](https://expressjs.com/), [Passport.js](https://www.passportjs.org/) and [MongoDB](https://www.mongodb.com/). We're going to authenticate the user with username and password, and authorize the user with a JWT token, and we also going to store the JWT token in a signed cookie.

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#getting-started">Getting Started</a>
    </li>
    <li>
      <a href="#folder-structure">Folder Structure</a>
    </li>
    <li><a href="#server-setup">Server setup</a></li>
    <li><a href="#routes-first-part">Routes (first part)</a></li>
    <li><a href="#models">Models</a></li>
    <li><a href="#controllers-first-part">Controllers (first part)</a></li>
    <li><a href="#passport-auth-strategy">Passport auth Stragy</a></li>
    <li><a href="#routes-second-part">Routes (second part)</a></li>
    <li><a href="#routes-final-part">Routes (final part)</a></li>
    <li><a href="#controllers-final-part">Controllers (final part)</a></li>
    <li><a href="#congratulations">Congratulations!</a></li>
  </ol>
</details>

## Getting Started

the first thing we're going to do is initialize a new project using npm (you can have npm by installing [nodejs](https://nodejs.org/en/) in your machine):

```bash
mkdir project
cd project
npm init -y
```

then we install the packeages needed:

```bash
npm install express mongoose passport passport-jwt passport-local jsonwebtoken bcrypt cors helmet morgan dotenv cookie-parser
```

- mongoose: we use mongoose to our db connection, in this case I'm working with MongoDB Atlas (Mongo offers a free tier)
- passport: this library will help use with the auth process
  - passport-jwt: we're going to use JWT for managing access to certain endpoints
  - passport-local: used for login users with username and password
- jsonwebtoken: library for generating our JWT token
- bcrypt: for hashing users passwords
- cors: to control Cross Site Origin Sharing, this is not mandatory but if you want to restrict the access to your server you'll need this
- helmet: give us headers for security
- morgan: a http logger
- dotenv: to manage env variables
- cookie-parser: used to store JWT in a cookie

you can find all the packages in [npm](https://www.npmjs.com/)

## Folder Structure

<a href="#">back to top</a>

create a _src_ folder to contain all of our files

```bash
src
│   .env
│   app.js
│   server.js
├───controllers
│       secret.controller.js
│       users.controller.js
├───keys
│       cert.pem
│       key.pem
├───middlewares
│       auth.js
│       permissions.js
├───models
│   │   users.model.js
│   └───mongo
│           users.mongo.js
├───public
├───routes
│       api.router.js
│       auth.router.js
│       secret.router.js
│       users.router.js
├───services
│       mongodb.js
└───utils
        hash.js
```

## Server setup

<a href="#">back to top</a>

We are going to use https, so you'll need a pair of keys for the TLS cetificate, this is easily obtained in you command shell using the next command:

```bash
openssl req -x509 -newkey rsa:4096 -nodes -keyout key.pem -out cert.pem -days AAA
```

be sure to replace "AAA" with a number of valid days for your keys. Also remember that this is just for development, if you're going to host the server live, you'll need a pair of keys issued from a Certificate Authority (CA).

> Note: if you're in windows, you can run this command in the bash console with comes with git installation.

### services/mongodb.js

First of all, we are going to create a file to handle db connection:

```js
const mongoose = require("mongoose");

require("dotenv").config();

const MONGO_URL = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}/${process.env.MONGO_DB}?retryWrites=true&w=majority`;

// deprecation warning from Mongoose 7
mongoose.set("strictQuery", false);

mongoose.connection.once("open", () => {
  console.log("MongoDB connected!");
});

mongoose.connection.on("error", err => {
  console.error(err);
});

async function mongoConnect() {
  await mongoose.connect(MONGO_URL);
}

async function mongoDisconnect() {
  await mongoose.disconnect();
}

module.exports = {
  mongoConnect,
  mongoDisconnect,
};
```

then, we create a server.js file in the root of our project. We do it this way in order to wait for the db to be online, and then start the server

### server.js

```js
const fs = require("fs");
const https = require("https");

const { mongoConnect } = require("./services/mongodb.js");

const PORT = process.env.PORT || 8080;

const app = require("./app");

const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, "keys", "key.pem")),
  cert: fs.readFileSync(path.join(__dirname, "keys", "cert.pem")),
};

const server = https.createServer(httpsOptions, app);

async function startServer() {
  await mongoConnect();
  server.listen(PORT, () => {
    console.log(`server running on port ${PORT}...`);
  });
}

startServer();
```

and after that, a _app.js_ file with our server configuration

### app.js

```js
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");
const passport = require("passport");
const cookierParser = require("cookie-parser");
require("dotenv").config({ path: path.join(__dirname, ".env") });

//set auth middlewares
require("./middlewares/auth");

const apiRouter = require("./routes/api.router");
const secretRouter = require("./routes/secret.router");

const app = express();

/** Middlewares */
// Secure by setting various HTTP Headers
app.use(helmet());
// CORS
app.use(cors());
//parses incoming requests with JSON payloads and is based on body-parser.
app.use(express.json());
// for store cookies
app.use(cookierParser("secret"));
// HTTP request logger
app.use(morgan("combined"));
// static files
app.use("/", express.static(path.join(__dirname, "public")));

app.use("/v1", apiRouter);
app.use("/secret", secretRouter);

app.get("/", (req, res) => {
  return res.status(200).json({
    message: "Hello World!",
  });
});

// Handle errors.
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({ error: err });
});

module.exports = app;
```

### utils/hash.js

and finally we are going to have a utils file to hash and compare passwords:

```js
const bcrypt = require("bcrypt");
/**
 * you can choose a bigger or smaller salt number, but be mindfull that
 * the hashing algorithm iterates: 2^saltRounds.
 * In brypt npm package, you can see the cost based on a 2GHz core:
 * rounds=8 : ~40 hashes/sec
 * rounds=9 : ~20 hashes/sec
 * rounds=10: ~10 hashes/sec
 * rounds=11: ~5  hashes/sec
 * rounds=12: 2-3 hashes/sec
 * rounds=13: ~1 sec/hash
 * rounds=14: ~1.5 sec/hash
 * rounds=15: ~3 sec/hash
 * rounds=25: ~1 hour/hash
 * rounds=31: 2-3 days/hash
 */
const saltRounds = 10;

async function hashPassword(plainPassword) {
  return await bcrypt.hash(plainPassword, saltRounds);
}

async function checkPassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

module.exports = {
  hashPassword,
  checkPassword,
};
```

## Routes (_first part_)

<a href="#">back to top</a>

Here, we are going to have a main route file called _api.router.js_, this file will handle the _users_ and _auth_ routes, we do this to now have to repeat the base route every time

### routes/api.router.js

```js
const express = require("express");

const usersRouter = require("./users.router");
const authRouter = require("./auth.router");

const api = express.Router();

api.use("/users", usersRouter);
api.use("/auth", authRouter);

module.exports = api;
```

### routes/users.router.js

next, we have the users route. In here we are going to manage all of our http request in terms of a RESTful API, with the exception of delete, because we are not going to delete a record from the db, but instead we are going to mark that users as a _inactive_ user. This is because the idea is not to lose data.

```js
const express = require("express");

const {
  httpGetUsers,
  httpCreateNewUser,
  httpGetOneUser,
  httpModifyUserFull,
  httpSetActiveToFalse,
  httpGetOwnUser,
} = require("../controllers/users.controller");

const usersRouter = express.Router();

// get all users: /users/
usersRouter.get("/", httpGetUsers);
// create a user: /users/
usersRouter.post("/", httpCreateNewUser);
// get one user; /users/:username
usersRouter.get("/:username", httpGetOneUser);
// modify a user: /users/:username
usersRouter.put("/:username", httpModifyUserFull);
// delete a user: /users/:username
usersRouter.delete("/:username", httpSetActiveToFalse);

module.exports = usersRouter;
```

Before moving on, let's work on our models:

## Models

<a href="#">back to top</a>

for this example, I'm using [MondoDB Atlas](https://www.mongodb.com/atlas) which has a free tier with share resources ([Mongo Pricing](https://www.mongodb.com/pricing)). So, make sure you have an account, otherwise you may explore a different database in which case you would need to define you own structure.

In order to create a Collection in MongoDB, you first need a schema. A schema is like a blueprint of your data, in this case we are going to have four fields: username, password, permissionlevel and active.

> **_permissionlevel_** is one of the field to authorize and access to a endpoint, it'll work as having: admin, superadmin, regular users, and so on.  
> **_active_** would tell us if the users is active or not

### models/mongo/users.mongo.js

```js
const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  permissionlevel: { type: Number, default: 1 },
  active: { type: Boolean, default: true },
});

/** 
 * You can define a pre save action, for instance: to hash the users password
 * we're not going to use this approach, instead we're going to manage this
 * inside of our controller, but I left this here so you know it
 
const bcrypt = require("bcrypt");
const saltRounds = 10;

// hashes password before save to db
usersSchema.pre("save", async function (next) {
  const user = this;
  const hashedPassword = await bcrypt.hash(user.password, saltRounds);
  this.password = hashedPassword;
  next();
});

// Also you can define methods, for instance: to check if the hashed are corrects
// validate that the new password matches the hashed password
usersSchema.methods.isValidPassword = async function (password) {
  const user = this;
  const result = await bcrypt.compare(password, user.password);
  return result;
};
*/

module.exports = mongoose.model("User", usersSchema);
```

Next, we take our user model and use it inside _users.model.js_. Kinda weird right? but we do this to have a separation between the definition of our models and the use of it

### models/users.models.js

```js
const userModel = require("./mongo/users.mongo");

// check if user exists
async function checkUsernameExists(username) {
  try {
    return await userModel.exists({ username: username });
  } catch (error) {
    throw new Error("An error ocurred while checking if user exists", error);
  }
}

// returns all users in db
/**
 * by using find with an empty object a first argument, we are saying that we want
 * all the records, this is because the first parameter is used to filter.
 * The second argument is saying that we don't want the columns: _id, _v,
 * and password. You can read more about this in mongoose docs
 */
async function getAllUsers() {
  try {
    return await userModel.find({}, { _id: 0, __v: 0, password: 0 });
  } catch (error) {
    throw new Error("An error ocurred while getting all users", error);
  }
}

// create a new user in db
async function createNewUser(newUser) {
  try {
    return await userModel.create(newUser);
  } catch (error) {
    throw new Error("An error ocurred while creating a new user", error);
  }
}

// get one user from db
async function getOneUser(username) {
  try {
    return await userModel.findOne(
      { username: username },
      { _id: 0, __v: 0, password: 0 }
    );
  } catch (error) {
    throw new Error("An error ocurred while getting one user", error);
  }
}

// can modify password, permissionlevel and active
async function modifyUserFull(username, modifiedUser) {
  try {
    return await userModel.findOneAndUpdate(
      { username: username },
      modifiedUser,
      {
        returnDocument: "after",
      }
    );
  } catch (error) {
    throw new Error("An error ocurred while modifying a user", error);
  }
}

// instead of deleting a record from db, it changes the active status to false
async function setActiveToFalse(username) {
  try {
    return await userModel.findOneAndUpdate(
      { username: username, active: true },
      {
        active: false,
      },
      {
        returnDocument: "after",
      }
    );
  } catch (error) {
    throw new Error("An error ocurred while setting active status", error);
  }
}

module.exports = {
  checkUsernameExists,
  getAllUsers,
  createNewUser,
  getOneUser,
  modifyUserFull,
  setActiveToFalse,
};
```

Alright, now we just need to finish our routes, and also controllers with have all the route handlers and finally look at the implementation of authentication and authorization, let's do it!

## Controllers (_first part_)

<a href="#">back to top</a>

### controllers/users.controller.js

Let's see the users controllers in which we have all of our http routes handlers.  
First we need to import all the necessary files, and define some constants that we are going to use later

```js
const {
  checkUsernameExists,
  getAllUsers,
  createNewUser,
  getOneUser,
  modifyUserFull,
  setActiveToFalse,
} = require("../models/users.model");

const { hashPassword } = require("../utils/hash");

// we define a minimun password lenght
const MIN_PASSWORD_LENGTH = 8;
// here I define 5 permission levels
const PERMISSION_LEVELS = [1, 2, 3, 4, 5];
// and here we have the active options, 0 for false, and 1 for true
const ACTIVE_OPTIONS = [0, 1];
```

Now, let's work on getting all users from our database. Here we use _getAllUsers_ function from users.models.js file. In case that the function don't return us a list of users, we show a message saying that there is no users in db. If we do have users, we show them as json with status code 200

```js
async function httpGetUsers(req, res) {
  const allUsers = await getAllUsers();

  if (!allUsers) {
    return res.status(200).json({
      message: "No users in db",
    });
  }

  return res.status(200).json(allUsers);
}
```

Then, let's create a new users. Here we do three things:

1. make sure there is no users with the same username
2. hashed the password
3. save to database

First we destructure the request.body, and if we lack one of the required fields, we send a response saying that a username and password must be provided. Next we check the length of the password. Then we check that our users doesn't exists, and if it does, we respond with a 409 code saying that the users already exists (Here you may want to change the message in order to not give that much info about the users). Lastly we hash the password using our utility function and then send it to be saved in the database using our _createNewUser_ function

```js
async function httpCreateNewUser(req, res) {
  const { username, password } = req.body;

  // validate that properties exists
  if (!username || !password) {
    return res.status(400).json({
      error: "Must provide username and password.",
    });
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return res.status(400).json({
      error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`,
    });
  }

  // validat if user exists in db
  const isAlreadyUser = await checkUsernameExists(username);

  if (isAlreadyUser) {
    return res.status(409).json({
      error: "User already exists",
    });
  }

  const hashedPassword = await hashPassword(password);

  const newUser = await createNewUser({
    username,
    password: hashedPassword,
  });

  if (!newUser) {
    return res.status(400).json({
      error: "An error ocurred while creating a user",
    });
  }

  return res.status(201).json(newUser);
}
```

To get one we need to get the username passed into the url, for this we use the property params of request, follow by the name of the parameters that we give in our users route file. Then we run a validation for the existense of the user

```js
async function httpGetOneUser(req, res) {
  const user = await getOneUser(req.params.username);

  if (!user) {
    return res.status(404).json({
      error: "User not found",
    });
  }
  return res.status(200).json(user);
}
```

For modify the user data we use a helper function that create a user object to be passed to the _modifyUserFull_ function. As before, we get the username from the request parameter, and the request body that we're going to pass to our helper function, but first we validate that the users exists.  
_createUserObject_ will do three things:

1. if we have a req.body.password, we check its length, then we hashed it and then save it to the _userModified_ object
2. if we have a req.body.permissionlevel, we check that is a valid permission value, and then store it inside the _userModified_ object
3. if we have a req.body.active, we check its value with an or because if req.body.active is equals to 0, it also means that is a falsy value, so we specify a strict equality in this case, and then also save it to _userModified_ object

and lastly we return the object. I want to make this because, at least this function is thought to be used only for admins (or level 5 permissionlevel), so, you can specify how many field you want to update by setting them in the request body.

Then we get back to our _httpModifyUserFull_ function in where we call _modifyUserFull_ to modify the user's data

```js
async function createUserObject(reqBody) {
  const userModified = {};

  // if password is passed, hashes the password after validate MIN_PASSWORD_LENGTH
  if (reqBody.password) {
    if (reqBody.password.length >= MIN_PASSWORD_LENGTH) {
      userModified["password"] = await hashPassword(reqBody.password);
    } else {
      return res.status(400).json({
        error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`,
      });
    }
  }

  // if permissionlevel is passed, validate that it's one of the available levels
  if (reqBody.permissionlevel) {
    if (PERMISSION_LEVELS.includes(reqBody.permissionlevel)) {
      userModified["permissionlevel"] = reqBody.permissionlevel;
    } else {
      return res.status(400).json({
        error: `Permission  level must be one of ${PERMISSION_LEVELS}`,
      });
    }
  }

  // if active is passed, validate that is: 1 or 0
  if (reqBody.active || reqBody.active === 0) {
    if (ACTIVE_OPTIONS.includes(reqBody.active)) {
      userModified["active"] = reqBody.active;
    } else {
      return res.status(400).json({
        error: `Active must be on of ${ACTIVE_OPTIONS}`,
      });
    }
  }

  return userModified;
}

async function httpModifyUserFull(req, res) {
  const username = req.params.username;
  const reqBody = req.body;

  // check if username was passed
  if (!username) {
    return res.status(400).json({
      error: "Must provide a username",
    });
  }

  //check if username exists
  const userExists = checkUsernameExists(username);
  if (!userExists) {
    return res.status(404).json({
      error: "User not found",
    });
  }

  // this will create a user object to be updated in base of the fields passed
  const userModified = await createUserObject(reqBody);

  const newUser = await modifyUserFull(username, userModified);

  return res.status(200).json(newUser);
}
```

Next, to "delete" a user we actually changes its active status to false, so then we retain the users information in our database, we also do our validations

```js
async function httpSetActiveToFalse(req, res) {
  const username = req.params.username;

  // check if username was passed
  if (!username) {
    return res.status(400).json({
      error: "Must provide a username",
    });
  }

  //check if username exists
  const userExists = checkUsernameExists(username);
  if (!userExists) {
    return res.status(404).json({
      error: "Username not found",
    });
  }

  const userWithActiveModified = await setActiveToFalse(username);

  if (!userWithActiveModified) {
    return res.status(404).json({
      error: "User not found",
    });
  }

  return res.status(200).json(userWithActiveModified);
}
```

Our final **_controllers/users.controller.js_** will look like this:

```js
const {
  checkUsernameExists,
  getAllUsers,
  createNewUser,
  getOneUser,
  modifyUserFull,
  setActiveToFalse,
} = require("../models/users.model");

const { hashPassword } = require("../utils/hash");

const MIN_PASSWORD_LENGTH = 8;
const PERMISSION_LEVELS = [1, 2, 3, 4, 5];
const ACTIVE_OPTIONS = [0, 1];

async function createUserObject(reqBody) {
  const userModified = {};

  // if password is passed, hashes the password after validate MIN_PASSWORD_LENGTH
  if (reqBody.password) {
    if (reqBody.password.length >= MIN_PASSWORD_LENGTH) {
      userModified["password"] = await hashPassword(reqBody.password);
    } else {
      return res.status(400).json({
        error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`,
      });
    }
  }

  // if permissionlevel is passed, validate that it's one of the available levels
  if (reqBody.permissionlevel) {
    if (PERMISSION_LEVELS.includes(reqBody.permissionlevel)) {
      userModified["permissionlevel"] = reqBody.permissionlevel;
    } else {
      return res.status(400).json({
        error: `Permission  level must be one of ${PERMISSION_LEVELS}`,
      });
    }
  }

  // if active is passed, validate that is: 1 or 0
  if (reqBody.active || reqBody.active === 0) {
    if (ACTIVE_OPTIONS.includes(reqBody.active)) {
      userModified["active"] = reqBody.active;
    } else {
      return res.status(400).json({
        error: `Active must be on of ${ACTIVE_OPTIONS}`,
      });
    }
  }

  return userModified;
}

async function httpGetUsers(req, res) {
  const allUsers = await getAllUsers();

  if (!allUsers) {
    return res.status(200).json({
      message: "No users in db",
    });
  }

  return res.status(200).json(allUsers);
}

async function httpCreateNewUser(req, res) {
  const { username, password } = req.body;

  // validate that properties exists
  if (!username || !password) {
    return res.status(400).json({
      error: "Must provide username and password.",
    });
  }

  // validat if user exists in db
  const isAlreadyUser = await checkUsernameExists(username);

  if (isAlreadyUser) {
    return res.status(409).json({
      error: "User already exists",
    });
  }

  const hashedPassword = await hashPassword(password);

  const newUser = await createNewUser({
    username,
    password: hashedPassword,
  });

  if (!newUser) {
    return res.status(400).json({
      error: "An error ocurred while creating a user",
    });
  }

  return res.status(201).json(newUser);
}

async function httpGetOneUser(req, res) {
  const user = await getOneUser(req.params.username);

  if (!user) {
    return res.status(404).json({
      error: "User not found",
    });
  }
  return res.status(200).json(user);
}

async function httpModifyUserFull(req, res) {
  const username = req.params.username;
  const reqBody = req.body;

  // check if username was passed
  if (!username) {
    return res.status(400).json({
      error: "Must provide a username",
    });
  }

  //check if username exists
  const userExists = checkUsernameExists(username);
  if (!userExists) {
    return res.status(404).json({
      error: "Username not found",
    });
  }

  // this will create a user object to be updated in base of the fields passed
  const userModified = await createUserObject(reqBody);

  const newUser = await modifyUserFull(username, userModified);

  return res.status(200).json(newUser);
}

async function httpSetActiveToFalse(req, res) {
  const username = req.params.username;

  // check if username was passed
  if (!username) {
    return res.status(400).json({
      error: "Must provide a username",
    });
  }

  //check if username exists
  const userExists = checkUsernameExists(username);
  if (!userExists) {
    return res.status(404).json({
      error: "Username not found",
    });
  }

  const userWithActiveModified = await setActiveToFalse(username);

  if (!userWithActiveModified) {
    return res.status(404).json({
      error: "User not found",
    });
  }

  return res.status(200).json(userWithActiveModified);
}

module.exports = {
  httpGetUsers,
  httpCreateNewUser,
  httpGetOneUser,
  httpModifyUserFull,
  httpSetActiveToFalse,
};
```

## Passport auth Strategy

<a href="#">back to top</a>

### middlewares/auth.js

As said before, in this example we are going to use [passport.js](https://www.passportjs.org/) to handle authentication and authorization. The way passport work is by setting strategies. Passport has a good amount of strategies for various authentication systems such as: regular username and password, JWT tokens, OAuth, OAuth2, and so on. We are going to use a regular username and password for the login, and set a JWT token just after the successful login in. First let's define the strategies:  
First we define our imports

```js
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JWTstrategy = require("passport-jwt").Strategy;
//const { ExtractJwt } = require("passport-jwt");

const UserModel = require("../models/mongo/users.mongo");
const { checkPassword } = require("../utils/hash");

// used for validate JWT token
const secretSignKey = process.env.SECRET_JWT_SIGN;
```

Next, we have our login strategy as follows.  
We set a named strategy to use later in our middleware. What this strategy do, is take the username and password from the request body, and first check if the user exists and is active, then we check the password match the hashed password, and finally we return done with the user object created (I create this user object to just send id and permissionlevel to req.user)

```js
passport.use(
  "login",
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    async (username, password, done) => {
      try {
        // check if users exists and is active
        const user = await UserModel.findOne({ username, active: true });

        if (!user) {
          return done(null, false, { message: "User not found" });
        }

        // validate password
        const validate = await checkPassword(password, user.password);

        if (!validate) {
          return done(null, false, { message: "Wrong Credentials" });
        }

        // create a user object to return
        const userData = {
          id: user._id,
          permissionlevel: user.permissionlevel,
        };

        return done(null, userData, { message: "Logged in Successfully" });
      } catch (error) {
        return done(error);
      }
    }
  )
);
```

And then we have the JWT Strategy, in this case I'm using cookies to store the token, so I create a custom extractor called _extractTokenFromCookie_, and as I'm using signed cookies, we have the token inside _req.signedCookies_.  
From _jwt_payload_ we get the user id (from the step before in which we create _userData_ with id and permissionlevel) and then run validations. Finally we do the same step as before, creating a _userData_ to be passed to req.user, if we don't do this, in the moment we access and authorize route, JWT Strategy will set req.user with whatever you passed in the second parameter of _done_ function

```js
const extractTokenFromCookie = req => {
  if (req && req.signedCookies.token) {
    return req.signedCookies.token;
  }
  return false;
};

const jwtOptions = {
  secretOrKey: secretSignKey,
  jwtFromRequest: extractTokenFromCookie,
};

passport.use(
  new JWTstrategy(jwtOptions, async (jwt_payload, done) => {
    try {
      const user = await UserModel.findOne({
        _id: jwt_payload.id,
        active: true,
      });

      if (!user) {
        return done(null, false);
      }

      const userData = {
        id: user._id,
        permissionlevel: user.permissionlevel,
      };

      return done(null, userData);
    } catch (error) {
      done(error);
    }
  })
);
```

Our final file would be the concatenation of the code above.

## Routes (_second part_)

<a href="#">back to top</a>

The next route we need is the:

### routes/auth.router.js

Here we are going to use the login strategy, first let's import our needed files.

```js
const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const authRouter = express.Router();

// to sign our JWT token
const secretSignKey = process.env.SECRET_JWT_SIGN;
// we set a expiration time of 8 hours
const EXPIRATION = 1000 * 60 * 60 * 8;
```

And then our login route. Here we pass a custom callback because we need to set the JWT token after a success log in. Note that the method _passport.authenticate_ has "login" as the first argument which is the name of the strategy used, and then the second argument has the done function of the login strategy.  
We first validate that we have a user and no errors, and then the login function sets req.user with the user data, set session to false because we're not using session, and in the callback function we set the JWT token after no errors.  
As payload we pass the user.id and user.permissionlevel, then we sign the token this the _secretSignKey_ (in our .env file), and set it expiration time, we also set a maxAge equals to the expiration time of the JWT token.  
Finally we return a signed cookie called "token", which is httpOnly and secure when NODE_ENV is in "production"

```js
authRouter.post("/login", (req, res, next) => {
  passport.authenticate("login", (err, user, info) => {
    try {
      if (err || !user) {
        const error = new Error(info.message);
        return next(error.message);
      }

      req.login(user, { session: false }, error => {
        if (error) return next(error);

        const payload = {
          id: user.id,
          permissionlevel: user.permissionlevel,
        };

        const token = jwt.sign(payload, secretSignKey, {
          expiresIn: EXPIRATION,
        });

        //return res.json({ token });
        return res
          .cookie("token", token, {
            signed: true,
            maxAge: EXPIRATION,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
          })
          .status(200)
          .json({
            message: "login successfully",
            user: req.user,
          });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});
```

Lastly we create a logout route to destroy the cookie

```js
authRouter.post("/logout", function (req, res) {
  return res.clearCookie("token").status(200).json({
    message: "Logged out succesfully",
  });
});

module.exports = authRouter;
```

We are almost done. The last thing we need to do is finish our routes and controllers to have some secret routes

## Routes (_final part_)

<a href="#">back to top</a>

Let's create some secrets http endpoints. First we import our files (we're going to see them in a bit)

### routes/secret.router.js

```js
const express = require("express");
const passport = require("passport");

const {
  hasPermissionLevelOne,
  hasPermissionLevelTwo,
  hasPermissionLevelThree,
  hasPermissionLevelFour,
  hasPermissionLevelFive,
} = require("../middlewares/permissions");

const {
  httpGetSecretLevel1,
  httpGetSecretLevel2,
  httpGetSecretLevel3,
  httpGetSecretLevel4,
  httpGetSecretLevel5,
} = require("../controllers/secret.controller");
```

and then we stablish our endpoint. We have 5 different endpoint that match our five permission levels. Please note that, in the first place we have our endpoint, then we have a JWT middleware which will check that our JWT token is valid, next we have a permission middleware, and finally our route handler.  
Note that here we have two types of authorization, a JWT token and a permission level.

```js
const secretRouter = express.Router();

secretRouter.get(
  "/level1",
  passport.authenticate("jwt", { session: false }),
  hasPermissionLevelOne,
  httpGetSecretLevel1
);
secretRouter.get(
  "/level2",
  passport.authenticate("jwt", { session: false }),
  hasPermissionLevelTwo,
  httpGetSecretLevel2
);
secretRouter.get(
  "/level3",
  passport.authenticate("jwt", { session: false }),
  hasPermissionLevelThree,
  httpGetSecretLevel3
);
secretRouter.get(
  "/level4",
  passport.authenticate("jwt", { session: false }),
  hasPermissionLevelFour,
  httpGetSecretLevel4
);
secretRouter.get(
  "/level5",
  passport.authenticate("jwt", { session: false }),
  hasPermissionLevelFive,
  httpGetSecretLevel5
);

module.exports = secretRouter;
```

### middlewares/permissions.js

Next a permission middleware. Which contains five function to check the corresponding permission level

```js
const permissions = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
};

function hasPermissionLevelOne(req, res, next) {
  if (req && req.user.permissionlevel >= permissions.one) {
    return next();
  } else {
    return res.status(403).json({
      error: "Access denied.",
    });
  }
}

function hasPermissionLevelTwo(req, res, next) {
  if (req && req.user.permissionlevel >= permissions.two) {
    return next();
  } else {
    return res.status(403).json({
      error: "Access denied.",
    });
  }
}

function hasPermissionLevelThree(req, res, next) {
  if (req && req.user.permissionlevel >= permissions.three) {
    return next();
  } else {
    return res.status(403).json({
      error: "Access denied.",
    });
  }
}

function hasPermissionLevelFour(req, res, next) {
  if (req && req.user.permissionlevel >= permissions.four) {
    return next();
  } else {
    return res.status(403).json({
      error: "Access denied.",
    });
  }
}

function hasPermissionLevelFive(req, res, next) {
  if (req && req.user.permissionlevel >= permissions.five) {
    return next();
  } else {
    return res.status(403).json({
      error: "Access denied.",
    });
  }
}

module.exports = {
  hasPermissionLevelOne,
  hasPermissionLevelTwo,
  hasPermissionLevelThree,
  hasPermissionLevelFour,
  hasPermissionLevelFive,
};
```

## Controllers (_final part_)

<a href="#">back to top</a>

And lastly the secret controllers.

### controllers/secret.controller.js

```js
function httpGetSecretLevel1(req, res) {
  return res.status(200).json({
    secret: "this is a level 1 secret",
  });
}

function httpGetSecretLevel2(req, res) {
  return res.status(200).json({
    secret: "this is a level 2 secret",
  });
}

function httpGetSecretLevel3(req, res) {
  return res.status(200).json({
    secret: "this is a level 3 secret",
  });
}

function httpGetSecretLevel4(req, res) {
  return res.status(200).json({
    secret: "this is a level 4 secret",
  });
}

function httpGetSecretLevel5(req, res) {
  return res.status(200).json({
    secret: "this is a level 5 secret",
  });
}

module.exports = {
  httpGetSecretLevel1,
  httpGetSecretLevel2,
  httpGetSecretLevel3,
  httpGetSecretLevel4,
  httpGetSecretLevel5,
};
```

## Congratulations!

<a href="#">back to top</a>

we have our server ready, let's test it on postman. ([Postman Collection](./UsersNodeAPI.postman_collection.json))
