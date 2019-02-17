const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// USER MODEL
const User = require('../models/User')

// LOGIN PAGE
router.get('/login', (req, res) => res.render('login'));

// REGISTER PAGE
router.get('/register', (req, res) => res.render('register'));

// REGISTER HANDLE

router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  // CHECK REQUIRED FIELDS
  if(!name || !email || !password || !password2){
    errors.push({ msg: 'פיספסת שדה' });
  }

  // CHECK PASSWORDS MATCH
  if(password !== password2){
    errors.push({ msg: 'סיסמאות לא תואמות' });
  }

  // CHECK PASS LENGTH
  if(password.length < 6){
    errors.push({ msg: 'הסיסמה חייבת להיות לפחות 6 אותיות' });
  }

  if(errors.length > 0){
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    // VALIDATION PASSED
    User.findOne({ email: email })
      .then(user => {
        if(user){
          // USER EXISTS
          errors.push({ msg: 'אימייל כבר רשומה' });
          res.render('register', {
            errors,
            name,
            email,
            password,
            password2
          });
        } else {
          const newUser = new User({
            name,
            email,
            password
          });

          // HASH PASSWORD
          bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) throw err;
            // SET PASSWORD TO HASHED
            newUser.password = hash;
            // SAVE USER
            newUser.save()
              .then(user => {
                req.flash('success_msg', 'אתה רשום ויכול להתחבר');
                res.redirect('/users/login');
              })
              .catch(err => console.log(err));
          }))
        }
      })
  }
});

// LOGIN HANDLE
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
})

// LOGOUT HANDLE
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'יצאת בהצלחה');
  res.redirect('/users/login');
});

module.exports = router;
