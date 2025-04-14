const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const memberModel = require('../models/memberModel');

exports.login = function (req, res, next) {
  const { username, password } = req.body;

  userModel.lookup(username)
    .then((user) => {
      if (!user) return res.status(401).send("User not found");
      return bcrypt.compare(password, user.password).then((match) => {
        if (match) {
          const token = jwt.sign({ username }, process.env.ACCESS_TOKEN_SECRET);
          res.cookie("jwt", token, { httpOnly: true, sameSite: "strict" });
          next();
        } else {
          res.status(403).send("Wrong password");
        }
      });
    })
    .catch((err) => {
      console.error("Login error:", err);
      res.status(500).send("Server error");
    });
};

exports.verify = function (req, res, next) {
  const token = req.cookies.jwt;
  if (!token) return res.status(401).send("Not authenticated");

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
    if (err) return res.status(403).send("Invalid token");
    req.user = payload.username;
    next();
  });
};

exports.userLogin = function (req, res, next) {
  const { username, password } = req.body;

  memberModel.lookup(username)
    .then((user) => {
      if (!user) return res.status(401).send("User not found");
      return bcrypt.compare(password, user.password).then((match) => {
        if (match) {
          const token = jwt.sign({ username, role: "user" }, process.env.ACCESS_TOKEN_SECRET);
          res.cookie("userJwt", token, { httpOnly: true, sameSite: "strict" });
          next();
        } else {
          res.status(403).send("Wrong password");
        }
      });
    })
    .catch((err) => {
      console.error("User login error:", err);
      res.status(500).send("Server error");
    });
};

exports.userVerify = function (req, res, next) {
    const token = req.cookies.userJwt;
    if (!token) return res.status(401).send("Not authenticated");
  
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
      if (err) return res.status(403).send("Invalid token");
      req.user = payload.username;
      next();
    });
};
  