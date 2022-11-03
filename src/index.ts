import express, { Express, Request, Response } from "express";
import { router } from "./public/api";

import './public/mongodb';
import './public/userDB';
import './public/service/auth_serv';

//引入mongodb模块
const mongoose = require('mongoose');

if (typeof window !== 'undefined') {
	console.log('You are on the browser')
	// ✅ Can use window here
  } else {
	console.log('You are on the server')
	// ⛔️ Don't use window here
  }

const path = require("path");
//运行user.ts页面里所有的代码
const Users = require('./public/userDB');

//创建express实例
const app: Express = express();

var cookieParser = require('cookie-parser');
var session = require('express-session');
app.use(cookieParser('session_Camagru'));

app.use(session({
	secret: 'sessiont_Camagru',//与cookieParser中的一致
	name: 'Camagru_xuwang',
	cookie: {maxAge: 24 * 7 * 3600}, //7天
	resave: true,
	saveUninitialized:true,  //保存初始化数据
}));

//dotenv
require('dotenv').config();

const port: any = process.env.PORT || 4000;

//joson parser for post requests
app.use(express.json());

app.use(router);

//静态资源目录 app.use(express.static('public')); 可以访问位于 public 目录中的文件
app.use('/public', express.static(path.resolve(__dirname, 'public')));


app.listen(port, () => {
console.log(`Server running at http://localhost:${port}...`);
});




