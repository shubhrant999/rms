
const timezone = 'Asia/Kolkata';




module.exports = {
    HOST: "localhost",
    USER: "root",
    PASSWORD: "",
    DB: "neurotalent",
    dialect: "mysql",
    timezone: timezone, //"+05:30",
    logging: true, 
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };