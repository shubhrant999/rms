module.exports = app => {
    const exam = require("../controllers/exam.js");

    var router = require("express").Router();
    router.get("/thank-you", exam.hiring_thankyou); 
    router.get("/time_hiring_check", exam.time_hiring_check); 
    router.get("/:token", exam.show_exam);
    router.all("/ajax/hiring_questions", exam.ajax_hiring_questions);   
    router.all("/ajax/hiring_submit", exam.hiring_question_submit);   
      
    app.use('/exam', router);
};