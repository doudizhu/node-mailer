const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const nodemailer = require('nodemailer')
require('dotenv').config()

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

        newUser.save().then((user)=>{
          res.status(200).json({
            state:'suc',
            msg:'添加用户成功',
            data:user,
          }).catch(err=>console.log(err))
        })
      }
    })
})

// app.post('/retrievePwd', (req, res) => {
//   User.findOne({ email: req.body.email }).then(user => {
//     console.log(user);
//   });
// });
app.post('/retrievePwd', (req, res) => {
  User.findOne({ username: req.body.username }).then(user => {
    if(!user){
      res.status(400).json({
        state: 'failed',
        msg: '该用户不存在',
      })
    }else{
      // step 1 通过哪个邮箱服务发送
      let transporter = nodemailer.createTransport({
        service: 'qq',
        secure: true,
        auth:{
          user: process.env.EMAIL, // 使用的邮箱
          pass: process.env.PASSWORD, // IMAP/SMTP服务
        },
      })
      // step 2 发送内容配置
      let mailOptions = {
        from: process.env.EMAIL, // 使用的邮箱
        to: req.body.email || user.email, // 发送至邮箱(请求发过来的，或者当前账户对应的)
        // cc:'抄送',
        // bcc:'密送',
        subject:'找回密码',
        text:`你的用户名：${user.username}，密码：${user.pwd}`,
      }
      // step 3 使用工具发送
      transporter.sendMail(mailOptions, (err, data) => {
        if(err){
          res.status(400).json({
            state: 'failed',
            msg: err,
          })
        }else{
          res.status(200).json({
            state:'suc',
            msg:`密码已发送至您的邮箱：${req.body.email}`
          })
        }
      })
    }
  });
});

const port = process.env.PORT || 5000

app.listen(port,()=>{
  console.log(`服务正在运行中，端口：${port}`)
})