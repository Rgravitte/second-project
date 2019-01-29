const express = require('express');
const router  = express.Router();
const passport = require('passport');
const bcryptjs   = require('bcryptjs');
const session     = require('express-session');
const User = require('../../models/Users');

router.get('/signup', (req, res, next)=>{
  res.render('users/signup-page')
});

router.get('/login', (req, res, nexrt)=>{
  res.render('users/user-login-page');
});

router.post('/users/user-page', (req, res, next)=>{
const salt = bcryptjs.genSaltSync(10);
const hashPass = bcryptjs.hashSync(req.body.password, salt);
  User.create({
    username: req.body.username,
    password: hashPass,
    interests: req.body.interests,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    birthday: req.body.birthday
  })
  .then((newUser)=>{
    req.login(newUser, (err)=>{
      if(err){
        let message = `Invalid inputs`;
        console.log("invalid input", message);
        res.render('/users/signup-page');
      }else{
        res.redirect('/user-page');
      }
    })
  })
          .catch((err)=>{
           
            next(err);
  })
});

router.post('/login', (req, res, next) => {
  User.findOne({username: req.body.username})
  .then((theUser)=>{
    message = false
    if(theUser === null){
      message = `there is no username: ${req.body.username}`;
      res.render('users/user-login-page', {message});
    }
    const isPassGood = bcryptjs.compareSync(req.body.password, theUser.password);
    if(isPassGood === false){
      message = `invalid password`;
      res.render('users/user-login-page', {message});
    }
    req.login(theUser, (err)=>{
      if(err){
        next(err);
      }
      else{
        res.render('/users/user-page');
      }
    })
  })
  .catch(err => {
    next(err);
  })
})

router.get('/user-page', (req, res, next)=>{


    if(!req.body.user){
      res.redirect('/signup');
    } else {
      let theUser = req.body.user;
      console.log(theUser);
      theUserprettyDate = theUser.birthday.toLocaleDateString("en-US");
      res.redirect('/user-page');
  }
})

router.get('/delete-page/:id', (req, res, next)=>{
  console.log(req.params, req.query)
  console.log('the ------- user ------- has -------- been -------- deleted')
  User.findByIdAndRemove(req.params.id)
  .then(()=>{
    res.redirect('/');

  })
  .catch((err)=>{
    next(err);
  })
})

router.get('/edit-interests', (req, res, next)=>{
  res.render('users/edit-interests');
 });


router.post('/edit-interests', (req, res, next)=>{
  User.findByIdAndUpdate(req.user.id, {
    interests: req.body.interests
  })

  .then((theUser)=>{
    theUser.save();
    console.log('--------', theUser)
    res.redirect('/users/user-page')
  })
  
  .catch((err)=>{
    next(err)
  })
})

router.get('/logout', (req, res, next)=>{
    req.logout();
    res.redirect('/');
})

module.exports = router;