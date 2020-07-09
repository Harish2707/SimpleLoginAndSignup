const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose'); 

var connection = mongoose.connect(`mongodb://localhost:27017/${process.env.DBName}`, {useNewUrlParser : true, useUnifiedTopology: true }, (err)=>{
    if(err){
        console.log("Not Connected to Mongodb "+ err);
    }else{
        console.log("Successfully Connected to Mongodb");
    }
});
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

module.exports = connection