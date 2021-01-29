const db = require("../models");
const Users = db.user;
const User_roles = db.user_roles;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// exports.login = (req, res) => {

//     Users.findOne({ where: { email: req.body.email } })
//           .then(data => {     
//             if (data===null) {
//               return res.status(401).json({
//                 message: "Auth failed"
//               });
//             }
            
//             bcrypt.compare(req.body.password, data.password, (err, result) => {
//               if (err) {
//                 return res.status(401).json({
//                   message: "Auth failed"
//                 });
//               }

//               // res.send(result);
//               if (result) {
//                 const token = jwt.sign(
//                   {
//                     email: data.email,
//                     userId: data.id
//                   },
//                   process.env.JWT_KEY,
//                   {
//                       expiresIn: "1h"
//                   }
//                 );
//                 return res.status(200).json({
//                   message: "Auth successful",
//                   token: token
//                 });
//               }
//               res.status(401).json({
//                 message: "Auth failed"
//               });
//             });
//           })
//           .catch(err => {
//             console.log(err);
//             res.status(500).json({
//               error: err
//             });
//         });
// };

exports.create = (req, res) => {
  
  if (!req.body.email) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({
        error: err
      });
    }

    const userRole = {
      id:1,
      role_name: 'admin',
      role_permissions: '{"dashboard":["index", "add","edit","delete","change_status","download_csv","print"],"user":["index", "add","edit","delete","change_status","download_csv","print"],"applied":["index", "add","edit","delete","change_status","download_csv","print","hold"],"shortlisted":["index", "add","edit","delete","change_status","download_csv","print","hold"],"interviewed":["index", "add","edit","delete","change_status","download_csv","print","hold"],"selected":["index", "add","edit","delete","change_status","download_csv","print","hold"],"rejected":["index", "download_csv","print"],"onboarded":["index","download_csv","print"],"onhold":["index", "delete","change_status","download_csv","print"]}',
      status: 0,
      deleted: 0
    };    

    User_roles.create(userRole)
      .then(roledata => {

        const user = {
          name: req.body.name,
          username: req.body.username,
          email: req.body.email,
          password: hash,
          role_id: req.body.role_id
        };

        Users.create(user)
          .then(data => {
            res.send(data);
          })
          .catch(err => {
            res.status(500).send({
              message:
                err.message || "Some error occurred while creating the Tutorial."
            });
          });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Tutorial."
        });
      });

    
    
  });
  

  
};

exports.createRole = (req, res) => {

  if (!req.body.role_name) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  const userRoll = {
      role_name: req.body.role_name,
      role_permissions: req.body.role_permissions,
      status: 0,
      deleted: 0
    };

  User_roles.create(userRoll)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Tutorial."
        });
      });
};


exports.allData = (req, res) => {

  Users.findAll({ include: [{ model: User_roles }], where: null })
    .then(data => {
      if (data === null) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }

      res.send(data[0].ntl_user_role);res.end();
     
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};