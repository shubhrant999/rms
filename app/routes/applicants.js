module.exports = app => {
    const applicant = require("../controllers/applicants.js");

    var router = require("express").Router();
    router.post("/add", applicant.add);
    app.use('/applicant', router);
};