const jwt = require("jsonwebtoken");


module.exports.verifyLogin = function(req, res, next) {
  if (req.session.userdata && req.cookies.user_sid) {
    const token = req.session.userdata.token;//req.header("token");
    if (!token) return res.status(401).json({ message: "Auth Error" });
    try {
      const decoded = jwt.verify(token, process.env.JWT_KEY);
      req.user = decoded.user;
      next();
    } catch (e) {
      console.error(e);
      res.status(500).send({ message: "Invalid Token" });
    }
  } else {
      res.redirect('/login');
  }
  
};

module.exports.checkPermission = function (action) {
  // return a middleware
  return (req, res, next) => {
    const userdata = req.session.userdata;
    if(req.session.permission){
      var permissionList = req.session.permission;
    }else{
      var permissionList = module.exports.allPermissions(userdata);
      req.session.permission = permissionList;      
    }
    //console.log(permissionList);   
    permission = req._parsedOriginalUrl.pathname;
    if(action){
      // permission = req._parsedOriginalUrl.pathname+'/'+action;   
      permission = req._parsedUrl.pathname+'/'+action;  
    }
      if (permissionList.includes(permission)){
        next(); 
      } else {
        res.status(403).json({message: 'Forbidden. You are not authorized to access this page.'}); 
      }
  }  
}


module.exports.allPermissions = function (userdata) {
  var arr = [];
  const a = JSON.parse(userdata.permission);
  Object.keys(a).forEach(function (key){      
      a[key].forEach(function (action){ 
        arr.push('/'+key+'/'+action);
      });
  });
  return arr;  
}







