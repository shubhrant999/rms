const checkAuth = require('../middleware/auth');
const verifyLogin = checkAuth.verifyLogin;
const checkPermission = checkAuth.checkPermission;
module.exports = app => {
    const application = require("../controllers/applications.js");

    var router = require("express").Router();
   
    
    router.get("/all", verifyLogin, application.all);
    




    
    router.all("/applied", [verifyLogin, checkPermission('index')], application.applied);
   
   
   
   
    router.post("/shortlisted/change_status", application.change_status);
    router.all("/get_edit_detail", application.get_edit_detail);
    router.all("/submit_edit_detail", application.submit_edit_detail);

    router.all("/get_comment_popup", application.get_comment_popup);


    router.all("/submit_comment", application.submit_comment);
    

    router.all("/shortlisted", [verifyLogin, checkPermission('index')], application.shortlisted);
        
    router.all("/interviewed", [verifyLogin, checkPermission('index')], application.interviewed);
    router.all("/selected", [verifyLogin, checkPermission('index')], application.selected);
    router.all("/rejected", [verifyLogin, checkPermission('index')], application.rejected);
    router.all("/onhold", [verifyLogin, checkPermission('index')], application.onhold);
    router.all("/onboarded", [verifyLogin, checkPermission('index')], application.onboarded);

  
  
    
    
    
    
    app.use('/admin', router);
};