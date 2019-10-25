const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  username:{
    type:String,
    required:true,
  },
  pwd:{
    type:String,
    required:true,
  },
  email:{
    type:String,
    required:true,
  },
  date:{
    type:Date,
    default: Date.now
  }
})

module.exports = User = mongoose.model('users',UserSchema)