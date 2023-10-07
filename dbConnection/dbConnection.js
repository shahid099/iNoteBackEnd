const mongoose = require('mongoose')
// =============== Mongodb Connection here. ==========
const dbConnect = ()=> {  
  try{
  let url = process.env.MONGODB_URL
  mongoose.connect(url)
    .then(()=> {
      console.log('connected to db successfully')
    })
  } catch(err) {
    console.log(err.message)
  }
}

// ============= Mongodb Connection End =============

module.exports = {
  dbConnect,
}