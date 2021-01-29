const db = require("../models");
const Users = db.user;
const User_roles = db.user_roles;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");




// res.send(req.session);

exports.login = (req, res) => {
    
    Users.findOne({ include: [{model : User_roles }], where: { email: req.body.email } })
          .then(data => {     
            if (data===null) {
              return res.status(401).json({
                message: "Auth failed"
              });
            }
            
            bcrypt.compare(req.body.password, data.password, (err, result) => {
              if (err) {
                return res.status(401).json({
                  message: "Auth failed"
                });
              }

              // res.send(data.ntl_user_role.role_name);     
              if (result) {
                const token = jwt.sign(
                  {
                    email: data.email,
                    userId: data.id
                  },
                  process.env.JWT_KEY,
                  {
                      expiresIn: "1h"
                  }
                );
                
                const user_data = {
                  userId : data.id,
                  role : data.ntl_user_role.role_name,
                  permission : data.ntl_user_role.role_permissions,
                  username : data.username,
                  token: token
                }
                
                req.session.userdata = user_data;
                var redirectionUrl = req.session.redirectUrl || '/admin/dashboard';
                return res.redirect(redirectionUrl);
                // return res.status(200).json({
                //   message: "Auth successful",
                //   token: token
                // });
              }
              res.status(401).json({
                message: "Auth failed"
              });
            });
          })
          .catch(err => {
            console.log(err);
            res.status(500).json({
              error: err
            });
        });
};


exports.logout = (req, res) => {
  if (req.session.userdata && req.cookies.user_sid) {
    res.clearCookie('user_sid');
    res.redirect('/login');
  } else {
      res.redirect('/login');
  }
};

