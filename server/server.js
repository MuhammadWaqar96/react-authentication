require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const utils = require("./utils");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const port = process.env.PORT || 3001;

let db = new sqlite3.Database("./test.db");
// let sql = "CREATE TABLE employee(id INTEGER PRIMARY KEY AUTOINCREMENT, requestDate text, joiningDate text, employeeId text, dob text, employeeName text, designation text, department text, property text, status text);"
// db.run(sql);
// db.close();
//Connect to database
// const db = new sqlite3.Database("./test.db", sqlite3.OPEN_READWRITE, (err) => {
//   if (err) return console.log(err.message);
// });

// static user details
// const userData = {
//   userId: "789789",
//   password: "123456",
//   name: "Clue Mediator",
//   username: "cluemediator",
//   isAdmin: true,
// };

app.get("/employees", (req, res) => {
  db.all("SELECT * FROM employee;", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.status(200).send(result);
    }
  });
});

app.get("/progress-employees", (req, res) => {
  db.all("SELECT * FROM employee where status = 'Progress';", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.status(200).send(result);
    }
  });
});

// enable CORS
app.use(cors());
// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//middleware that checks if JWT token exists and verifies it if it does exist.
//In all future routes, this helps to know if the request is authenticated or not.
app.use(function (req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.headers["authorization"];
  if (!token) return next(); //if no token, continue

  token = token.replace("Bearer ", "");
  jwt.verify(token, process.env.JWT_SECRET, function (err, user) {
    if (err) {
      return res.status(401).json({
        error: true,
        message: "Invalid user.",
      });
    } else {
      req.user = user; //set the user to req so other routes can use it
      next();
    }
  });
});

// request handlers
app.get("/", (req, res) => {
  if (!req.user)
    return res
      .status(401)
      .json({ success: false, message: "Invalid user to access it." });
  res.send("Welcome to the Node.js Tutorial! - " + req.user.name);
});

// validate the user credentials
app.post("/users/signin", function (req, res) {
  const user = req.body.username;
  const pwd = req.body.password;

  // return 400 status if username/password is not exist
  if (!user || !pwd) {
    return res.status(400).json({
      error: true,
      message: "Username or Password required.",
    });
  }

  let sql = "SELECT * FROM login WHERE username = ?;";
  db.get(sql, user, (err, result) => {
    if (err) {
      return res.status(401).json({
        error: true,
        message: err,
      });
    }
    if (result != null) {
      const token = utils.generateToken(result);
      const userObj = utils.getCleanUser(result);
      return res.json({ user: userObj, token });
    }
    else{
      return res.status(401).json({
        error: true,
        message: "Username or password is not authenticated"
      });
    }
  });

  // generate token
  // const token = utils.generateToken(userData);
  // get basic user details
  // const userObj = utils.getCleanUser(userData);
  // return the token along with user details
  // return res.json({ user: userObj, token });
});

// verify the token and return it if it's valid
app.get("/verifyToken", function (req, res) {
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token;
  if (!token) {
    return res.status(400).json({
      error: true,
      message: "Token is required.",
    });
  }
  // check token that was passed by decoding token using secret
  jwt.verify(token, process.env.JWT_SECRET, function (err, user) {
    if (err)
      return res.status(401).json({
        error: true,
        message: "Invalid token.",
      });

    // return 401 status if the userId does not match.
    if (user.userId !== userData.userId) {
      return res.status(401).json({
        error: true,
        message: "Invalid user.",
      });
    }
    // get basic user details
    var userObj = utils.getCleanUser(userData);
    return res.json({ user: userObj, token });
  });
});

// create employee
app.post("/create", (req, res) => {
  console.log(req.body);
  const requestDate = req.body.requestDate;
  const joiningDate = req.body.joiningDate;
  const employeeId = req.body.employeeId;
  const dob = req.body.dob;
  const employeeName = req.body.employeeName;
  const designation = req.body.designation;
  const department = req.body.department;
  const property = req.body.property;
  const status = "Progress";

  let sql = `INSERT INTO employee
(requestDate, joiningDate, employeeId, dob, employeeName, designation, department, property, status)
VALUES(?, ?, ?, ?, ?, ?, ?, ?,?);`;

  db.run(
    sql,
    [
      requestDate,
      joiningDate,
      employeeId,
      dob,
      employeeName,
      designation,
      department,
      property,
      status,
    ],
    (err, result) => {
      if (err) {
        return console.error(err.message);
      }
    }
  );

  return res.status(200).send("success");
});

app.listen(port, () => {
  console.log("Server started on: " + port);
});
