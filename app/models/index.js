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
db.country = require("./Country.js")(sequelize, Sequelize);
db.applicant = require("./Applicant.js")(sequelize, Sequelize);

db.user = require("./User.js")(sequelize, Sequelize);
db.user_roles = require("./user_roles.js")(sequelize, Sequelize);
db.user_roles.hasMany(db.user, { as: "users" });
db.user.belongsTo(db.user_roles, {foreignKey: 'role_id'});

db.application = require("./application.js")(sequelize, Sequelize);
db.applicant.hasMany(db.application, { as: "app" });
db.application.belongsTo(db.applicant, { foreignKey: 'applicant_id'});

module.exports = db;