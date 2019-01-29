const express = require('express');
const router  = express.Router();
const passport = require('passport');
const bcryptjs   = require('bcryptjs');
const session     = require('express-session');
const User = require('../../models/Users');

router.get('/signup', (req, res, next)=>{
  res.render('users/signup-page');
});

router.get('/login', (req, res, nexrt)=>{
  res.render('users/user-login-page');
});

router.post('/signup', (req, res, next)=>{

  if(req.body.password !== req.body.confirmPassword){
    console.log('Passwords do not match');
    res.redirect('/signup');
    return;
  }
  User.findOne({username: req.body.username})
  .then((user)=>{
    if(user !== null){
      console.log('This username is taken');
      res.redirect('/signup');
      return;
    }
    else if(!user){
      console.log('please provide a username');
      res.redirect('/signup');
      return;
    }
    const salt = bcryptjs.genSaltSync(10);
    const hashPass = bcryptjs.hashSync(req.body.password, salt);
    req.body.password = hashPass;
    const newUser = req.body;

    User.create(newUser)
    .then((newUser)=>{
      req.login(newUser, (err)=>{
        if(err){
          console.log('Invalid User Inputs');
          res.redirect('/signup');
          return;
        }
          res.redirect(`/${newUser._id}/user-page`);
        })
      })
      
      .catch((err)=>{
        next(err);
      })
      .catch((err)=>{
        next(err);
      })
    })
  });

  router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
  }));

router.get('/:id/user-page', (req, res, next)=>{
  User.findById(req.params.id).populate()
  .then((user)=>{
    if(!req.user._id.equals(user._id)){
      req.logOut();
      res.redirect('/login');
      return;
    }
    user.prettyDate = user.birthday.toLocaleDateString("en-US");
    res.render('users/user-page', { user })
    .catch((err)=>{
      next(err);
    })
  })
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
    res.redirect('/user-page');
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