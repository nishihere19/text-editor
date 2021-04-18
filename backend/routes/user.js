const express = require('express');
const router = express.Router();
const User = require('../model/User')
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json()
const cookieParser = require('cookie-parser')
const middleware = require('../middleware/auth');
router.use(jsonParser)
router.use(cookieParser())
const {JWT_SECRET} = require('../key/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/new', function(req, res) {
 
  User.find({email:req.body.email}).then(result=>{
    if(result.length>0) res.send({status:500,msg:"User exists"});
    else{
      bcrypt.hash(req.body.password, 14).then(hashPassword => {
        user = new User({
          email: req.body.email,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          password: hashPassword
        })
        user.save().then(myuser=>{
          res.json({
            status:200,
            msg:'success'
          })
        })
      })
    }
  })

});

router.post('/sign_in', function (req, res) {
  //console.log(req.body);
  User.find({email:req.body.email}).then(user=>{
    bcrypt.compare(req.body.password, user[0].password)
    .then(ifMatch=>{
      if (!ifMatch)
          {
            console.log("Password not matching!");
            return res.status(400).json({ AuthErr: 'password incorrect' })}
        // return res.json({Auth:'successfully loged in'});          
        const token = jwt.sign({ _id: user[0]._id }, JWT_SECRET);
        console.log(token);
        res.json({
              status: 200,
              msg: "success",
              token:token
            })

    })
    .catch(err=>{
      console.log(err);
    }).catch(err => res.status(400).json({ AuthErr: 'not found your email' }))
  })

});



router.get('/userinfo',middleware, (req, res) => {
    User.findOne({_id:req.user._id}).then(userinfo=>{
    res.json({
      status:200,
      msg:'success',
      user:userinfo
    })
  })
})

module.exports = router;
