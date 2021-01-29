const { render } = require("ejs");
const db = require("../models");
const Applicant = db.applicant;
const Application = db.application;
const helper = require("../helper");
const limit = 5;


exports.all = (req, res, next) => {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    var condition =null;
    var options = { currentStage: '', status: 1, appr_reject: 0, appr_rejc_label: 1, stage: 1 }

    Application.findAll({
        include: Applicant,
        limit: limit,
        offset: req.query.page ? (parseInt(req.query.page) - 1) * limit : 0,
        where: condition
    })
        .then(data => {
            res.render('admin/applied', { data: data, page: page, option: options });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving tutorials."
            });
        });
};


exports.applied = async (req, res, next) => {
    let current_stage = 0;
    var getfilter = helper.getFilters(req, current_stage);
    condition = getfilter.condition;
    joincondition = getfilter.joincondition;
    // var encryptedData = await helper.cryptData('shubhrant');
    // var decryptData = await helper.compareCryptData('shubhran', encryptedData);
    const page = req.query.page ? parseInt(req.query.page) : 1;    
    var options = { 
        currentStage: 'Applied', 
        nextStage: 'Shortlist', 
        status: 1, 
        appr_reject: 0, 
        appr_rejc_label:1, 
        stage:1,
        path: req._parsedUrl.pathname,
        permission : req.session.permission,
        req: req.body,
        requestType: req.method
    }

    Application.findAll({
        include: [{ model: Applicant, where: joincondition }],
        limit: limit,
        offset: req.query.page ? (parseInt(req.query.page) - 1) * limit : 0,
        where: condition,
        order: [
            ['updatedAt', 'DESC']
        ]
    })
        .then(data => {
            res.render('admin/applied', { data: data, page: page, option:options });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving tutorials."
            });
        });
};

exports.shortlisted = (req, res, next) => {
    let current_stage = 1;
    var getfilter = helper.getFilters(req, current_stage);
    condition = getfilter.condition;
    joincondition = getfilter.joincondition;


    const page = req.query.page ? parseInt(req.query.page) : 1;
    var options = { 
        currentStage: 'Shortlisted', 
        nextStage: 'Interview', 
        status: 1, 
        appr_reject: 0, 
        appr_rejc_label: 2, 
        stage: 2,
        path: req._parsedUrl.pathname,
        permission: req.session.permission,
        req: req.body,
        requestType: req.method    
    }
    Application.findAll({
        include: [{ model: Applicant, where: joincondition }],
        limit: limit,
        offset: req.query.page ? (parseInt(req.query.page) - 1) * limit : 0,
        where: condition,
        order: [
            ['updatedAt', 'DESC']
        ]
    })
    .then(data => {
        res.render('admin/applied', { data: data, page: page, option:options });
    })
    .catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving tutorials."
        });
    });
};

exports.interviewed = (req, res, next) => {
    let current_stage = 2;
    var getfilter = helper.getFilters(req, current_stage);
    condition = getfilter.condition;
    joincondition = getfilter.joincondition;


    const page = req.query.page ? parseInt(req.query.page) : 1;
    var options = { 
        currentStage: 'Interviewed', 
        nextStage: 'Select', 
        status: 1, 
        appr_reject: 0, 
        appr_rejc_label: 3, 
        stage: 3,
        path: req._parsedUrl.pathname,
        permission: req.session.permission,
        req: req.body,
        requestType: req.method   
    }
    Application.findAll({
        include: Applicant,
        limit: limit,
        offset: req.query.page ? (parseInt(req.query.page) - 1) * limit : 0,
        where: condition, 
        order: [
            ['updatedAt', 'DESC']
        ]
    })
        .then(data => {
            res.render('admin/applied', { data: data, page: page, option: options });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving tutorials."
            });
        });
};

exports.selected = (req, res, next) => {
    let current_stage = 3;
    var getfilter = helper.getFilters(req, current_stage);
    condition = getfilter.condition;
    joincondition = getfilter.joincondition;

    const page = req.query.page ? parseInt(req.query.page) : 1;
    var options = { 
        currentStage: 'Selected', 
        nextStage: 'Onboard', 
        status: 1, 
        appr_reject: 1, 
        appr_rejc_label: 3, 
        stage: 4,
        path: req._parsedUrl.pathname,
        permission: req.session.permission,
        req: req.body,
        requestType: req.method  
    }
    Application.findAll({
        include: Applicant,
        limit: limit,
        offset: req.query.page ? (parseInt(req.query.page) - 1) * limit : 0,
        where: condition,
        order: [
            ['updatedAt', 'DESC']
        ]
    })
        .then(data => {
            res.render('admin/applied', { data: data, page: page, option: options });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving tutorials."
            });
        });
};

exports.onboarded = (req, res, next) => {
    let current_stage = 4;
    var getfilter = helper.getFilters(req, current_stage);
    condition = getfilter.condition;
    joincondition = getfilter.joincondition;

    const page = req.query.page ? parseInt(req.query.page) : 1;
    var options = { 
        currentStage: 'Onboarded', 
        status: 1, 
        appr_reject: 1, 
        appr_rejc_label: 3, 
        stage: 5,
        path: req._parsedUrl.pathname,
        permission: req.session.permission,
        req: req.body,
        requestType: req.method   
    }
    Application.findAll({
        include: Applicant,
        limit: limit,
        offset: req.query.page ? (parseInt(req.query.page) - 1) * limit : 0,
        where: condition,
        order: [
            ['updatedAt', 'DESC']
        ]
    })
        .then(data => {
            res.render('admin/applied', { data: data, page: page, option: options });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving tutorials."
            });
        });
};

exports.rejected = (req, res, next) => {

    let current_stage = 5;
    var getfilter = helper.getFilters(req, current_stage);
    condition = getfilter.condition;
    joincondition = getfilter.joincondition;

    const page = req.query.page ? parseInt(req.query.page) : 1;
    var options = { 
        currentStage: 'Rejected', 
        status: 1, 
        appr_reject: 2, 
        appr_rejc_label: 3, 
        stage: 6,
        path: req._parsedUrl.pathname,
        permission: req.session.permission,
        req: req.body,
        requestType: req.method   
    }
    Application.findAll({
        include: Applicant,
        limit: limit,
        offset: req.query.page ? (parseInt(req.query.page) - 1) * limit : 0,
        where: condition,
        order: [
            ['updatedAt', 'DESC']
        ]
    })
        .then(data => {
            res.render('admin/applied', { data: data, page: page, option: options});
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving tutorials."
            });
        });
};

exports.onhold = (req, res, next) => {
    let current_stage = 6;
    var getfilter = helper.getFilters(req, current_stage);
    condition = getfilter.condition;
    joincondition = getfilter.joincondition;

    const page = req.query.page ? parseInt(req.query.page) : 1;
    var options = { 
        currentStage: 'On-hold', 
        status: 1, 
        appr_reject: 5, 
        appr_rejc_label: 3, 
        stage: 7,
        path: req._parsedUrl.pathname,
        permission: req.session.permission,
        req: req.body,
        requestType: req.method   
    }
    Application.findAll({
        include: Applicant,
        limit: limit,
        offset: req.query.page ? (parseInt(req.query.page) - 1) * limit : 0,
        where: condition,
        order: [
            ['updatedAt', 'DESC']
        ]
    })
        .then(data => {
            res.render('admin/applied', { data: data, page: page, option: options });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving tutorials."
            });
        });
};

exports.change_status = (req, res) => {
    var id = req.body.id;   
    var stage = req.body.stage;  
    var appr_reject = req.body.appr_reject
    if(id) {        
        Application.findOne({ where: { id: id } })            
            .then(data => {                
                if(data){
                    // 6= oh-hold, 5=reject
                    if (stage==6){
                        var changeData = {
                            appr_reject : appr_reject,
                            appr_rejc_label : data.appr_rejc_label,
                            current_stage : stage
                        };
                    }else if(stage==5){
                        var changeData = {
                            appr_reject : appr_reject,
                            appr_rejc_label : data.appr_rejc_label,
                            current_stage : stage
                        };
                    }else{
                        var changeData = {
                            appr_reject : req.body.appr_reject,
                            appr_rejc_label : req.body.appr_rejc_label,
                            current_stage : stage
                        };
                    }
                    Application.update(changeData, { where: { id: id } } )
                    .then(data => {                       
                        var stageEmail = {
                            subject:'This is just a neuro test email',
                            content:'<h1>Welcome</h1><p>That was easy!</p>'
                        };
                        helper.send_email('ajaycs0009@gmail.com, shubhrants@neuronimbus.com', stageEmail.subject, stageEmail.content);
                        res.json({ msg: 'Record has been moved successfully', type: 'success' });
                    })
                    .catch(err => {
                        res.json({ msg: 'There is something wrong', type: 'error' });
                    });                    
                }
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving tutorials."
                });
            });
    }
};


exports.get_edit_detail = (req, res) => {    
    var id = req.body.id;
    if (id) {
        Application.findOne({ include: Applicant, where: { id: id } })
            .then(data => {
                if (data) {                  
                    res.render('admin/editpopup', { data: data });
                }
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving tutorials."
                });
            });
    }
};

exports.submit_edit_detail = (req, res) => {  
    var id = req.body.appl_id;
    if (id) {
        Application.findOne({ where: { id: id } })
            .then(data => {
                if (data) {                    
                    var updateData = {
                        aadhaar: req.body.aadhaar,
                        dob: req.body.dob,
                        location: req.body.location,
                        phone: req.body.phone,                        
                    };                    
                    Applicant.update(updateData, { where: { id: data.applicant_id } })
                        .then(data => {
                            res.json({ msg: 'Record has been updated successfully', type: 'success' });
                        })
                        .catch(err => {
                            res.json({ msg: 'There is something wrong', type: 'error' });
                        });
                }
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred."
                });
            });
    }
};






exports.findOne = (req, res) => {
};
exports.update = (req, res) => {
};
exports.delete = (req, res) => {
};

// // Delete all Tutorials from the database.
// exports.deleteAll = (req, res) => {
//     Tutorial.destroy({
//         where: {},
//         truncate: false
//     })
//         .then(nums => {
//             res.send({ message: `${nums} Tutorials were deleted successfully!` });
//         })
//         .catch(err => {
//             res.status(500).send({
//                 message:
//                     err.message || "Some error occurred while removing all tutorials."
//             });
//         });
// };

// Find all published Tutorials
// exports.findAllPublished = (req, res) => {
//   Tutorial.findAll({ where: { published: true } })
//     .then(data => {
//       res.send(data);
//     })
//     .catch(err => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while retrieving tutorials."
//       });
//     });
// };