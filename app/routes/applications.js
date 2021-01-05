const checkAuth = require('../middleware/auth');
const verifyLogin = checkAuth.verifyLogin;

module.exports = app => {
    const application = require("../controllers/applications.js");

    var router = require("express").Router();
    router.get("/:id", verifyLogin, application.all_application);


    router.get("/all", verifyLogin, application.all_application);
    router.post("all/edit", verifyLogin, application.edit);
    router.post("all/comment", verifyLogin, application.edit);
    router.post("all/change_status", verifyLogin, application.edit);
    router.post("all/print", verifyLogin, application.edit);




    router.get("/applied", application.applied);6
    router.post("/applied/edit", application.edit);
    router.post("/applied/comment", application.delete);
    router.post("/applied/change_status", application.delete);
    router.post("/applied/print", application.delete);
    
    
    
    
    router.get("/shortlisted", application.shortlisted);
    router.post("/shortlisted/edit", application.edit);
    router.post("/shortlisted");
    router.post("shortlisted");
    router.post("shortlisted", application.);


    router.get("/interviewed", application.interviewed);
    router.get("/selected", application);
    router.get("/onboarded", application);
    router.get("/onhold", application);
    router.get("/rejected", application);
    



















    // Update a Tutorial with id
    router.put("/:id", vacancy.update);

    // Delete a Tutorial with id
    router.delete("/:id", vacancy.delete);

    // Delete all Tutorials
    router.delete("/", vacancy.deleteAll);

    app.use('/api/vacancy_category', router);
};