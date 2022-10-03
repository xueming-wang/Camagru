import express, { Express, Request, Response } from "express";
import { router } from "./public/route";
import './public/mongodb';
import './public/userDB';
import './public/service/auth_serv';
//引入mongodb模块
const mongoose = require('mongoose');

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
	cookie: {maxAge: 100000},
	resave: true,
	saveUninitialized:true,
}));

app.all('*', function(_req:any, res:any, next) {
	res.header("Access-Control-Allow-Origin", "http://localhost:8080");
	res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
	res.header('Access-Control-Allow-Credentials', 'true');
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	next();
});

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




