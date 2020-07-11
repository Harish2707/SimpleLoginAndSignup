const express = require('express');
const router = express.Router();
const passport = require('passport');
const cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/user')
const { forwardAuthenticated } = require('../config/auth');

const initializePassport = require('../config/passport-config')
initializePassport(passport, User)

const app = express()
app.use(cookieParser())

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: process.env.SENDER_MAIL,
        pass: process.env.SENDER_PASSWORD
    }
});

//Login Routes
router.get('/login', forwardAuthenticated, (req, res) =>{
    res.render('login',{message: req.flash('error')})
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/api/login',
    failureFlash: true
    })(req, res, next);
})

//Register Routes
router.get('/register', forwardAuthenticated, (req, res) => {
    res.render('register')
})

router.post('/register', (req, res)=>{
    var verify = Math.floor((Math.random() * 10000000) + 1);

    var mailOption = {
        from : process.env.SENDER_MAIL, // sender email
        to : `${req.body.email}`, // receiver email
        subject: "Account Verification",
        html: `<h4>Hello User Please Click on this link to Activate your account</h4>
        <br><a href="${process.env.CLIENT_URL}${process.env.PORT}/api/verification/?verify=${verify}">CLICK ME TO ACTIVATE YOUR ACCOUNT</a>`
    }

    var user = new User();
    user.name  = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password;
    user.verification = verify
    user.save((err)=>{
        if (err){
            res.render('register',{message: 'Email already exists'});
        }else{
            transporter.sendMail(mailOption, (err, info) => {
                if(err){
                    console.log(err)      
                }else{
                    let userdata = {
                        email : req.body.email
                    }
                    res.cookie("UserInfo", userdata)
                    res.send('<center><h1> Email has been sent, kindly activate your account</h1></center>')
                }
            })
            console.log("Inserted to DB Successfully");
        }
    });

});

//Account Verification
router.get('/verification/',(req, res) => {
    const activateAcc = (verification) => {
        if(verification == req.query.verify){
            var myquery =  { active : false }
            var newquery = { $set: { active: true} }
            User.updateOne( myquery, newquery, (err, result) => {
                if(err){
                    console.log(err);
                }
                else{
                    res.render('login',{ message: 'Account Verified Successfully'})
                }
            })
        }else{
            res.send("<h1>verification failed</h1>")
        }
    }
    console.log(req.cookies.UserInfo.email)
    User.findOne({ email: req.cookies.UserInfo.email}, (err, res) => {
        if(err) {
            console.log(err)
        }else{
            activateAcc(res.verification)
        }
    })
})

//Forget Password Routes
router.get('/forget', (req, res) => {
    res.render('forgetPassword')
})

router.post('/forget', (req, res) => {
    let email = req.body.email
    console.log(email)
    var mailOption = {
        from : process.env.SENDER_MAIL, // sender email
        to : `${email}`, // receiver email
        subject: "Reset Password Link",
        html: `<h4>Hello User Please Click on this link to Reset your password</h4>
        <br><a href="${process.env.CLIENT_URL}${process.env.PORT}/api/reset/">CLICK ME TO RESET PASSWORD</a>`
    }
    User.findOne({ email: email}, (err, result)=>{
        if(err){
            res.render('forgetPassword',{message: "Email is not registered"})
        }else{
            if(result == null){
                res.render('forgetPassword',{message: "Email is not registered"})
            }
            transporter.sendMail(mailOption, (err, info) => {
                if(err){
                    console.log(err)      
                }else{
                    let userdata = {
                    email : req.body.email
                }
                res.cookie("EmailInfo", userdata)
                res.send('<center><h1> Email has been sent, kindly Reset your Password</h1></center>')
                }
            })
            
        }
    })
})

//Reset Password Routes
router.get('/reset', (req, res) => {
    res.render('resetPassword')
})

router.post('/reset', (req, res) => {
    let password1 = req.body.password1;
    let password2 = req.body.password2;
    if (password1 != password2){
        res.render('resetPassword',{message: "Passwords does not match"})
    }else{
        User.updateOne({email:req.cookies.EmailInfo.email},{password: password1},(err, result) => {
            if(err){
                console.log(err);
            }else{
                res.render('login', { message: 'Account Password is Reset Successfully'})
            }
        })
    }
})

//Logout Route
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router