const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
require('./config/connectionDB')
const passport = require('passport')
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');  
const dotenv = require('dotenv');
dotenv.config();

const app  = express();
const PORT = process.env.PORT

//middleware
app.use(morgan('dev'));
app.use(bodyParser.json()); //parse request for json 
app.use(bodyParser.urlencoded({ extended: true })); //parse requests for urlencoded

//EJS
app.set("view engine", "ejs")

//Connect flash
app.use(flash());

//Express Session
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
);

// cookie parser
app.use(cookieParser());

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Routes
app.use('/',require('./routes/index'));
app.use('/api', require('./routes/api'));
app.use('/auth', require('./routes/auth'))

process.setMaxListeners(0)

app.listen(PORT, ()=>{
    console.log(`Server running on ${process.env.CLIENT_URL}${PORT}/`);
})