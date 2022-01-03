const Sequelize = require("sequelize");
exports.create_db = (req, res) => {
 
        HOST = "localhost"
        USER="root";
        PASSWORD="";
        DB="test-qms";
        DIALECT="mysql";
        timezone = 'Asia/Kolkata'; 
        logging=true;
        PORT=3306;
    
        const mysql = require('mysql2');
        var con = mysql.createConnection({
            host: HOST,
            user: USER,
            password: PASSWORD
        });

        con.connect(function (err) {
            if (err) throw err;
            con.query(`CREATE DATABASE IF NOT EXISTS  \`${DB}\`;`, function (err, result) {
                if (err) throw err;
                console.log("Database created");
            });
        });
    
        const sequelize = new Sequelize(DB, USER, PASSWORD, {
            host: HOST,
            dialect: DIALECT,
            operatorsAliases: 0,
            logging: false
        });

    const db = {};
    db.Sequelize = Sequelize;
    db.sequelize = sequelize;

    db.vacancy = require("../models/Vacancy.js")(sequelize, Sequelize);
    db.applicant = require("../models/Applicant.js")(sequelize, Sequelize);

    // db.user = require("./User.js")(sequelize, Sequelize);
    // db.user_roles = require("./user_roles.js")(sequelize, Sequelize);
    // db.user_roles.hasMany(db.user, { as: "users" });
    // db.user.belongsTo(db.user_roles, { foreignKey: 'role_id' });

    // db.application = require("./application.js")(sequelize, Sequelize);
    // db.applicant.hasMany(db.application, { as: "app" });
    // db.application.belongsTo(db.applicant, { foreignKey: 'applicant_id' });
    // db.application.belongsTo(db.vacancy, { foreignKey: 'vacancy_id' });

    // db.comment = require("./comment.js")(sequelize, Sequelize);
    // db.comment.belongsTo(db.application, { foreignKey: 'appl_id' });
    // db.comment.belongsTo(db.user, { foreignKey: 'added_by' })

    // db.exam_detail = require("./exam.js").exam_detail(sequelize, Sequelize);
    // db.exam_detail.belongsTo(db.application, { foreignKey: 'appl_id' });
    // db.exam_detail.belongsTo(db.applicant, { foreignKey: 'candidate_id' });

    // db.exam_temp_questions = require("./exam.js").exam_temp_questions(sequelize, Sequelize);
    // db.exam_log = require("./exam.js").exam_log(sequelize, Sequelize);
    // db.exam_log.belongsTo(db.exam_detail, { foreignKey: 'exam_id' });
    // db.exam_answer_sheet = require("./exam.js").exam_answer_sheet(sequelize, Sequelize);
    // db.exam_answer_sheet.belongsTo(db.exam_detail, { foreignKey: 'exam_id' });

    // db.question = require("./question.js").question(sequelize, Sequelize);

    // db.question_type = require("./question.js").question_type(sequelize, Sequelize);
    // db.question.belongsTo(db.question_type, { foreignKey: 'question_type' });
    // db.question.belongsTo(db.vacancy, { foreignKey: 'vacancy_id' });
    // db.competency = require("./question.js").competency(sequelize, Sequelize);

    db.sequelize.sync();

};
// module.exports = db;