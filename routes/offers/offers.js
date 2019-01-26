const express = require('express');
const router  = express.Router();
const User = require('../../models/Users');
const Offer = require('../../models/Offers');
const Deals = require('../../models/Deals');

router.get('/offers-page', (req, res, next)=>{
  Offer.find()    
  // Deals.find()
  .then((response)=>{
    //  console.log('-------=======----------==========----------', Deals.isAccepted);
    
    
    console.log('===========&&&&&&&&&&&============&&&&&&&&&&===========', response)
    const equalInterests = response.filter(offer)
    // =>{
    //   for(let i = 0; i < req.user.interests.length; i++){
    //     if(offer.industry === req.user.interests[i]){
    //       return response + offer;
    //     }
    //   }
    // })
    res.render('/offers-page', {offer: equalInterests})
  })
  // .then(()=>{
    // if the deals accepted === fals then i want to delete the deals
    // if the deals accepted === true then i want to add the deals to the user page
    // if(Deals.isAccepted === false){
    //   Deals.findByIdAndDelete();
    // }
    // else{

    // }
  // })
  .catch((err)=>{
    next(err);
  })
})
router.post('/create-deal', (req, res, next)=>{
 
    Deals.create({
      isAccepted: true,
      offers: req.body.id,
    })
    .then((theNewDeal)=>{
      console.log(theNewDeal)
      res.redirect('/')
    })
    .catch((err)=>{
      console.log('09090909090909090909090909090909090909090909090909090', err);
      next(err)
    })
  });
router.get('/user-page', (req, res, next)=>{
  Deals.find()
  .then((value)=>{
    if(value = false){
      Deals.findByIdAndDelete();
    }else{
      console.log('hey its accepted')
    }
  })
  .catch((err)=>{
    console.log(err);
  })
})

router.post('/offers-page', (req, res, next)=>{
Offer.create({
  companyName: String,
  industry: String,
  // user: Object.Types
})
.then(()=>{
  res.redirect('/offers-page')
  console.log('-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=', Offer);
//   res.redirect('/users/user-page')
})
.catch((err)=>{
  console.log('09090909090909090909090909090909090909090909090909090', err);
  next(err)
})
})




module.exports = router;