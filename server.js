const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const session = require('express-session');
const morgan = require('morgan');
const cors = require("cors");
const path = require("path");
const dotenv = require('dotenv');
const db = require("./app/models");
// const { table } = require("console");
const app = express();

dotenv.config();
db.sequelize.sync(
  // {logging: console.log}
);
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });


var corsOptions = {
  origin: "http://localhost:4200"
};
app.use(cors(corsOptions));
// app.use(morgan('dev'));
app.use(cookieParser());
app.use(session({
    key: 'user_sid',
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/assets'));

// let reporter = function (type, ...rest) {
//   // remote reporter logic goes here
// };

/* handle an uncaught exception & exit the process */
// process.on('uncaughtException', function (err) {
//   console.error((new Date).toUTCString() + ' uncaughtException:', err.message);
//   console.error(err.stack);

//   reporter("uncaughtException", (new Date).toUTCString(), err.message, err.stack);

//   process.exit(1);
// });

/* handle an unhandled promise rejection */
// process.on('unhandledRejection', function (reason, promise) {
//   console.error('unhandled rejection:', reason.message || reason);
//   reporter("uncaughtException", (new Date).toUTCString(), reason.message || reason);
// })

// const generate_uid = require("./app/routes/generate_uid");
// const customer = require("./app/routes/customer");
// app.use('/api/v1/generate_uid', generate_uid);
// app.use('/api/v1/customer', customer);

// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });


global.getAge = function (dateString) {
  var today = new Date();
  var birthDate = new Date(dateString);
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}


app.get("/", (req, res) => {
  res.render('frontend/application_form', { title: 'Express' });
});


require("./app/routes/vacancy.routes")(app);
require("./app/routes/users")(app);
require("./app/routes/login")(app);
require("./app/routes/applications")(app);
require("./app/routes/applicants")(app);
require("./app/routes/dashboard")(app);

app.use(function (req, res, next) {
  res.render('error', { title: 'Express' });
});
// set port, listen for requests
const PORT = process.env.PORT || 5000;
app.listen(PORT);