const { render } = require("ejs");
const db = require("../models");
const Applicant = db.applicant;
const Application = db.application;
const Comment = db.comment;
const helper = require("../helper");
const limit = 5;
var moment = require('moment');
moment.tz.setDefault('Asia/Kolkata');


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
        Application.findOne({ where: { id: id },raw:true })            
            .then(data => {                
                if(data){
                    // 6= oh-hold, 5=reject
                    if (stage == 1){
                        move_to_shortlisted(data);
                    }else if(stage==6){
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
                        helper.send_email('shubhrants@neuronimbus.com', stageEmail.subject, stageEmail.content);
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
                    res.render('admin/edit_popup', { data: data });
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


exports.get_comment_popup = (req, res) => {
    var id = req.body.id;
    if (id) {
        Application.findOne({ include: Applicant, where: { id: id } })
            .then(data => {
                if (data) {                    
                    var commentList = ['first comment','second comment','third comment','forth comment'];
                    res.render('admin/comment_popup', { data: data, commentList: commentList });
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


exports.submit_comment = (req, res) => {
    var id = req.body.appl_id;
    var comment = req.body.comment;
    if (req.body.comment=='other'){
        comment = req.body.comment_area;
    }
    if(id) {
        Application.findOne({ where: { id: id } })
            .then(data => {
                if (data) {
                    var commentData = {
                        comment: req.body.comment,
                        added_by: req.session.userdata.userId,
                        appl_id:id
                    };
                    Comment.create(commentData)
                        .then(data => {
                            res.json({ msg: 'Comment has been added successfully', type: 'success' });
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

async function move_to_shortlisted(appl_data){    
    if(send_link(appl_data)) {
        response = {
            status:1,
            redirect_url : contr_url,
            msg: 'MCQ has been successfully shared with the candidate.'
        }
        console.log(response);
        // return response;
    } else {
        response = {
            status: 1,
            redirect_url: contr_url,
            msg: constants.ADMIN_ITEM_STATUS_ERROR
        }

        console.log(response);
        // return response;
    }

}

async function send_link(appl_data = false) {

    if (appl_data) {

    //     $apply_record = $this -> common_model -> get_record('applied_jobs', 'status, user_id', array('appl_id' => $appl_id));
    //     $job_userid = !empty($apply_record -> user_id) ? $apply_record -> user_id : '';
    //     $job_user_data = $this -> common_model -> get_record('jobusers', 'user_role, user_id', array('user_id' => $job_userid));

    //     // check user already send job exam link
       // $job_exam = $this -> common_model -> get_record('job_exam', 'appl_id', array('appl_id' => $appl_id));
        exam_data = await Exam.findOne({ where: { appl_id: appl_data.id } })
        .then(questions_existing_result => {
            return questions_existing_result;
        }).catch(function () {
            console.log("Promise Rejected23");
        }); 
       
       
        if (exam_data) {
            return false;
        } else if ($apply_record) {
            token = generate_hash();
            exam_url = '../exam/'+token;
            postdata = {
                candidate_id : user_id,
                appl_id : appl_id,
                exam_url : exam_url,
                token : token,
                start_time: moment().format('YYYY-MM-DD HH:mm:ss'),
                status : 1,
                passing_percentage: constants.PASSING_PERCENTAGE,
            }
            Exam.create(postdata);

    //         $this -> common_model -> update_record($this -> table, array('appr_reject' => "$status", 'appr_rejc_label' => 1), array($this -> table_id => $appl_id));
    //         $this -> status_log($appl_id, $status, 1);

    //         if (!empty($job_id)) {
    //             $actdata = $this -> common_model -> get_record('apollo_action', '*', array('action_type' => 2, 'applied_id'=> $appl_id));

    //             if (empty($actdata)) {
    //                 $action_data = array('action_type'=> 2, 'applied_id'=> $appl_id);
    //                 $action_id = $this -> common_model -> save_record('apollo_action', $action_data);
    //             }
    //             else {
    //                 $action_data = array('action_date'=> date('Y-m-d H:i:s'), 'updated'=> date('Y-m-d H:i:s'));
    //                 $action_id = $this -> common_model -> update_record('apollo_action', $action_data, array('action_type' => 2, 'applied_id'=> $appl_id));
    //             }
    //         }
    //         $template = $this -> common_model -> get_record('email_sms_template', '*', array('template_alias' => 'send_link'));

    //         $join = array(
    //             array('table' => 'store as s', 'on' => 's.store_id='.$this -> alias. '.store_id', 'type' => 'left'),
    //             array('table' => 'users as u', 'on' => 'u.id=s.store_manager', 'type' => 'left'),
    //             array('table' => 'jobusers as ju', 'on' => 'ju.user_id='.$this -> alias. '.user_id', 'type' => 'left'),
    //         );
    //         $user = $this -> common_model -> get_record($this -> table. ' AS '.$this -> alias, 'u.name as rgm,ju.name, ju.email_id, ju.mobile,'.$this -> alias.'.apply_date', array('appl_id' => $appl_id), $join);

    //         $customer_name = !empty($user -> name) ? $user -> name : '';
    //         $customer_email = !empty($user -> email_id) ? $user -> email_id : '';
    //         $customer_mobile = !empty($user -> mobile) ? $user -> mobile : '';
    //         $rgm = !empty($user -> rgm) ? ucwords($user -> rgm) : '';

    //         $sms_template = $template -> template_sms;

    //         $patterns = array('/XX_SEND_LINK_XX/', '/XX_CUSTOMER_NAME_XX/');
    //         $replacements = array($exam_url, $customer_name);
    //         $sms_text = preg_replace($patterns, $replacements, $sms_template);
    //         send_otp_sms($customer_mobile, $sms_text);

    //         $email_template = $template -> template_email;

    //         $patterns = array('/XX_CUSTOMER_NAME_XX/', '/XX_SEND_LINK_XX/');
    //         $replacements = array($customer_name, $exam_url);
    //         $email_text = preg_replace($patterns, $replacements, $email_template);
    //         $id = $appl_id.'/'.date('m', strtotime($user -> apply_date)).''.date('Y', strtotime($user -> apply_date));
    //         $data['exam_link'] = $exam_url;
    //         $data['user_name'] = $customer_name;
    //         $data['id'] = $id;
    //         $to = $customer_email;
    //         if (!empty($to)) {
    //             //$subject = $template->template_title;
    //             $subject = 'Job Exam Link';
    //             $this -> email -> from(ADMIN_EMAIL, ADMIN_USER_NAME);
    //             $this -> email -> to($to);

    //             $this -> email -> subject($subject);
    //             $this -> email -> set_mailtype("html");

    //             //$email_message = $this->load->view(ADMIN . 'emailtemplates/send_link_mailer', $data, true);
    //             $email_message = $this -> load -> view(ADMIN. 'emailtemplates/apollo_send_hiring_link_mailer', $data, true);
    //             $this -> email -> message($email_message);
    //             $this -> email -> send();
    //             $this -> email -> clear(TRUE);
    //         }

    //         if ($job_id) {
    //             return true;

    //         } else {


    //             $this -> session -> set_flashdata('errorMsg', ADMIN_ITEM_STATUS_ERROR);
    //             echo json_encode(array('status' => 1, 'redirect_url' => $this -> contr_url)); exit;
    //         }

        }
    // } else {
    //     return false;
    }

}


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