require("dotenv").config();

const mongoose = require('mongoose')


const ConnectDB = (uri) => {
    console.log(` i am connecteing`)

   return  mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    
});
}

module.exports = ConnectDB 