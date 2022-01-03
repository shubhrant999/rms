const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const session = require('express-session');
const morgan = require('morgan');
const cors = require("cors");
const path = require("path");
const dotenv = require('dotenv');

const db = require("./app/models/sub-org");

global.constants = require("./app/config/constants");
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
        expires: 3600000// 60*60*1000
    }
}));



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/assets'));

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


global.get_color_dot = function (status) {
  status = status ? status : 'blank';
  switch (status) {
    case (status == 'blank'):
      cls = "grey-dot";
      break;
    case (status === '1' || status === 1):
      cls = "grn-dots green-dot";
      break;
    case (status == 3):
      cls = "nxt_prev_ques yel-dots yellow-dot";
      break;
    case (status == 2):
      cls = "nxt_prev_ques red-dots red-dot";
      break;
    case (!status):
      cls = "grey-dot";
      break;
    default:
      cls = "grey-dot";
  }
  return cls;
}




app.get("/", (req, res) => {
  res.render('frontend/application_form', { title: 'Express' });
});


require("./app/routes/vacancy.routes")(app);
require("./app/routes/users")(app);
require("./app/routes/login")(app);
// require("./app/routes/applications")(app);
require("./app/routes/applicants")(app);
require("./app/routes/exam")(app);
require("./app/routes/dashboard")(app);
require("./app/routes/test")(app);

app.use(function (req, res, next) {
  res.render('error', { title: 'Express' });
});
// set port, listen for requests
const PORT = process.env.PORT || 5000;
app.listen(PORT);