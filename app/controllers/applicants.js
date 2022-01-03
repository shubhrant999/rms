const { render } = require("ejs");
const moment = require("moment");
const db = require("../models");
const Applicant = db.applicant;
const Application = db.application;
const Op = db.Sequelize.Op;
// const helper = require("../helper.js")

exports.add = (req, res) => {

    // Validate request
    if (!req.body.emailAddress) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // var encryptedData = await helper.cryptData('shubhrant');
    // var decryptData = await helper.compareCryptData('shubhran', encryptedData);

    const applicant_data = {
        name: req.body.fullname,
        email: req.body.emailAddress,
        phone: req.body.phoneNumber,
        aadhaar: req.body.aadharnumber,
        gender: req.body.gender,
        dob: moment(req.body.start_date, "MM-DD-YYYY"),
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        country: req.body.country,
        preferred_location: req.body.preferred_location,
        qualification: req.body.qualification,
        total_experience: req.body.total_experience,
        relavent_experience: req.body.relavent_experience,
        resume: req.body.resume,
        status: req.body.status ? req.body.status : "0",
        deleted: req.body.deleted ? req.body.deleted : "0"
    };
    
    Applicant.create(applicant_data)
        .then(data => {
            const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            const application_data = {                			
                applicant_id: data.id,
                vacancy_id: 1,
                location_id: 1,
                city_id: 1,
                user_current_location: req.body.city,
                user_preferred_location: req.body.preferred_location,
                ip_address: ip,    
                appr_reject:0,
                appr_reject_label: 0,
                onboarding_req_send:0, 
                current_stage:0,          
                status: req.body.status ? req.body.status : "0",
                deleted: req.body.deleted ? req.body.deleted : "0"
            };
            Application.create(application_data)
                .then(appdata => {
                    // const a = getAge(applicant_data.dob);
                    res.send('<h3>Your application has been submited successfully. We will get back to you soon.</h3>');
                })
                .catch (err => {
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
};