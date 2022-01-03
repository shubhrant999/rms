const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: 0,
  logging: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.vacancy = require("./Vacancy.js")(sequelize, Sequelize);
db.applicant = require("./Applicant.js")(sequelize, Sequelize);

db.user = require("./User.js")(sequelize, Sequelize);
db.user_roles = require("./user_roles.js")(sequelize, Sequelize);
db.user_roles.hasMany(db.user, { as: "users" });
db.user.belongsTo(db.user_roles, {foreignKey: 'role_id'});

db.application = require("./application.js")(sequelize, Sequelize);
db.applicant.hasMany(db.application, { as: "app" });
db.application.belongsTo(db.applicant, { foreignKey: 'applicant_id'});
db.application.belongsTo(db.vacancy, { foreignKey: 'vacancy_id'});




db.comment = require("./comment.js")(sequelize, Sequelize);
db.comment.belongsTo(db.application, { foreignKey: 'appl_id' });
db.comment.belongsTo(db.user, {foreignKey: 'added_by'})




db.exam_detail = require("./exam.js").exam_detail(sequelize, Sequelize);
db.exam_detail.belongsTo(db.application, { foreignKey: 'appl_id' });
db.exam_detail.belongsTo(db.applicant, { foreignKey: 'candidate_id' });



db.exam_temp_questions = require("./exam.js").exam_temp_questions(sequelize, Sequelize);
db.exam_log = require("./exam.js").exam_log(sequelize, Sequelize);
db.exam_log.belongsTo(db.exam_detail, { foreignKey: 'exam_id' });
db.exam_answer_sheet = require("./exam.js").exam_answer_sheet(sequelize, Sequelize);
db.exam_answer_sheet.belongsTo(db.exam_detail, { foreignKey: 'exam_id' });

db.question = require("./question.js").question(sequelize, Sequelize);

db.question_type = require("./question.js").question_type(sequelize, Sequelize);
db.question.belongsTo(db.question_type, { foreignKey: 'question_type' });
db.question.belongsTo(db.vacancy, { foreignKey: 'vacancy_id' });
db.competency = require("./question.js").competency(sequelize, Sequelize);



module.exports = db;