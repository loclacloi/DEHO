const mongoose = require('mongoose')
require('dotenv').config()


const connectDB = async() => {
 try {
   await mongoose.connect(process.env.MONGODB_URI)
   console.log('anh tới với các em ddaay')
 } catch(error) {
    console.log(error);

 }
}


module.exports = connectDB;