const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const nodemailer = require('nodemailer')

const User = require('./models/User')

const app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

// connect mongodb
mongoose.connect(
  'mongodb://nodemailer:test1234@ds249137.mlab.com:49137/nodemailer-api1',
  {useNewUrlParser:true}
  )
  .then(()=>{
    console.log('MongoDB connected...')
  })
  .catch(err=>console.log(err))

app.get('/',(req,res)=>{
  res.json({state:'suc',msg:'it works'})
})

app.post('/addUser',(req,res)=>{
  // console.log(req.body)
  User.findOne({username:req.body.username})
    .then(user=>{
      if(user){
        res.status(400).json({
          state: 'failed',
          msg:'该用户已存在',
        })
      }else{
        const newUser = new User({
          username: req.body.username,
          pwd: req.body.pwd,
          email: req.body.email,
        })

        newUser.save().then(()=>{
          res.status(200).json({
            state:'suc',
            msg:'添加用户成功',
            data:user,
          }).catch(err=>console.log(err))
        })
      }
    })
})

const port = process.env.PORT || 5000

app.listen(port,()=>{
  console.log(`服务正在运行中，端口：${port}`)
})