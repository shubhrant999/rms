// const express = require("express");
// const router = express.Router();
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");


module.exports = app => {
  const Users = require("../controllers/users.js");  
  var router = require("express").Router();
  router.get("/", Users.allData); 
  router.post("/", Users.create);    
  router.post("/role", Users.createRole);    
  app.use('/user', router);
}