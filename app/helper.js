'use strict';

var nodemailer = require('nodemailer');
var moment = require('moment');
const db = require("./models");
const Op = db.Sequelize.Op;
var bcrypt = require('bcrypt');


const crypto = require('crypto');
const ENCRYPTION_KEY = 'thisismyprivatekeyforencriptions';//process.env.ENCRYPTION_KEY; // Must be 256 bits (32 characters)
const IV_LENGTH = 16; // For AES, this is always 16


//https://stackoverflow.com/questions/14015677/node-js-hashing-of-passwords

module.exports.multiplyByTwo = function (x) { return x * 2 }
module.exports.divideByTwo = function (x) { return x / 2 }
function nonExportedFunction(x) {
    return x * 3
}


module.exports.calculate_age = function (birth_month, birth_day, birth_year) {
    today_date = new Date();
    today_year = today_date.getFullYear();
    today_month = today_date.getMonth();
    today_day = today_date.getDate();
    age = today_year - birth_year;

    if (today_month < (birth_month - 1)) {
        age--;
    }
    if (((birth_month - 1) == today_month) && (today_day < birth_day)) {
        age--;
    }
    return age;
}


module.exports.send_email = function (recipients, subject, content) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'shubhrant999@gmail.com',
            pass: 'shubh@9999'
        }
    });

    var mailOptions = {
        from: 'shubhrant999@gmail.com',
        to: recipients,//'myfriend@yahoo.com, myotherfriend@yahoo.com',
        subject: 'Sending Neuro Test Email',
        html: content//'<h1>Welcome</h1><p>That was easy!</p>'
    }

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports.getFilters = function (req, current_stage){   

    var condition = {};
    var joincondition = {};
   
    if (req.method == "POST") {        

        if (req.body.start_date)
            start_date = moment(req.body.start_date, 'DD/MM/YYYY').format('YYYY-MM-DD');
        else
            start_date = moment().subtract(90, 'days').format('YYYY-MM-DD')

        if (req.body.end_date)
            end_date = moment(req.body.end_date, 'DD/MM/YYYY').format('YYYY-MM-DD');
        else
            end_date = moment().format('YYYY-MM-DD');

        condition = {
            createdAt: {
                [Op.and]: {
                    [Op.gte]: start_date,
                    [Op.lte]: end_date
                }
            }
        };
        
        
        if (req.body.appl_no) condition.id = req.body.appl_no;

        if (req.body.email) joincondition.email = req.body.email;
        if (req.body.mobile) joincondition.phone = req.body.mobile;
        if (req.body.aadhaar) joincondition.aadhaar = req.body.aadhaar;
        if ((req.body.gender) && (req.body.gender !== '-1')) joincondition.gender = req.body.gender;
        if (req.body.state) joincondition.state = req.body.state;
        if (req.body.city) joincondition.city = req.body.city;
        if (req.body.location) joincondition.location = req.body.location;
    } 

    condition.current_stage = current_stage;
    var filters = { condition : condition, joincondition:joincondition }
    return filters;
    
}


module.exports.generate_hash = function(aadhaar){

}

module.exports.str_encode = function (text) {
    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text);

    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return iv.toString('hex') + ':' + encrypted.toString('hex');

}

module.exports.str_decode = function (text) {
    let textParts = text.split(':');
    let iv = Buffer.from(textParts.shift(), 'hex');
    let encryptedText = Buffer.from(textParts.join(':'), 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encryptedText);

    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
}




exports.cryptData = async function (str) {
    let hashed = await bcrypt.genSalt(10);
    return await bcrypt.hash(str, hashed);

    // bcrypt.genSalt(10, function (err, salt) {
    //     bcrypt.hash(str, salt, function (err, hash) {
    //         console.log(hash+'here');
    //         return hash;
    //     });
    // });
};

exports.compareCryptData = async function (str, hashstr) {
    return await bcrypt.compare(str, hashstr);
};


// var path = require('path');
                    // var filePath = "./app/views/admin/editpopup.ejs"
                    // var resolvedPath = path.resolve(filePath);
                    // console.log(resolvedPath);
                    // res.sendFile(resolvedPath);

// res.app.render('admin/editpopup', { layout: false }, function (err, html) {
                    //     var response = {
                    //         some_data: 'blablabla',
                    //         some_more_data: [5, 8, 10, 67],
                    //         my_html: html
                    //     };
                    //     res.send(response);
                    // });

exports.array_combine = async function (keys, values) {
    const newArray = {}
    let i = 0
    if (typeof keys !== 'object') {
        return false
    }
    if (typeof values !== 'object') {
        return false
    }
    if (typeof keys.length !== 'number') {
        return false
    }
    if (typeof values.length !== 'number') {
        return false
    }
    if (!keys.length) {
        return false
    }
    // number of elements does not match
    if (keys.length !== values.length) {
        return false
    }
    for (i = 0; i < keys.length; i++) {
        newArray[keys[i]] = values[i]
    }
    return newArray
}

exports.array_column = async function (array, columnName) {
    return array.map(function (value, index) {
        return value[columnName];
    })
}