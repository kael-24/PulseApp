const mongoose = require('mongoose');
const userSchema = require('./schemas/userSchema');
const userAuthStatics = require('./statics/userAuthStatics');
const userEditStatics = require('./statics/userEditStatics');

userAuthStatics(userSchema);
userEditStatics(userSchema);

module.exports = mongoose.model('User', userSchema);