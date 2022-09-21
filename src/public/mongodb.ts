require('dotenv').config();

// /** 1) Install & Set up mongoose */
const mongoose = require('mongoose');
const url = process.env['MONGO_URL'];

// //连接database
mongoose.connect(url, 
	{ useNewUrlParser: true, useUnifiedTopology: true});

mongoose.connection.on('error', function(err:any) {
	console.log('数据库连接失败', err);
});

mongoose.connection.on('connected', function() {
	console.log('数据库连接成功!!!!');
});

mongoose.connection.on('disconnected', function() {
	console.log('数据库断开连接');
});

module.exports = mongoose;




