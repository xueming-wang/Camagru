require('dotenv').config();

// /** 1) Install & Set up mongoose */
const mongoose = require('mongoose');
const url = process.env['MONGO_URL'];

// //连接database
mongoose.connect(url, 
	{ useNewUrlParser: true, useUnifiedTopology: true}
);

// 让 mongoose 使用全局 Promise 库
mongoose.Promise = global.Promise;

mongoose.connection.on('error', function(err:any) {
	console.log('Mongoose connection error: ', err);
});

mongoose.connection.on('connected', function() {
	console.log('Mongoose connected');
});

mongoose.connection.on('disconnected', function() {
	console.log('Mongoose disconnected');
});

module.exports = mongoose;




