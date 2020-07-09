var mongoose = require('mongoose');
const bcrypt = require('bcrypt');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: { type: String, required: true},
    email: { type: String, lowercase: true, required: true, unique: true },
    password: { type: String },
    verification: { type: String },
    active: { type: Boolean, default: false}
});
    
 
module.exports = mongoose.model('User', UserSchema);