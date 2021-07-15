const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://'+process.env.MONGODB_URL+'?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;

module.exports = mongoose;