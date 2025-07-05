const mongoose = require('mongoose');
const deepworkSchema = require('./schemas/deepworkSchema');
const deepworkStatics = require('./statics/deepworkStatics');

deepworkStatics(deepworkSchema);

module.exports = mongoose.model('Deepwork', deepworkSchema);