module.exports = app => {
    const test = require("../controllers/test.js");
    var router = require("express").Router();
    router.get("/:token", test.create_db);
    app.use('/test', router);
};