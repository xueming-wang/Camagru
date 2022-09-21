import express, { Express, Request, Response } from "express";
import { router } from "./public/route";
import './public/mongodb';
import './public/user';

//引入mongodb模块
const mongoose = require('mongoose');

const path = require("path");
//运行user.ts页面里所有的代码
const Users = require('./public/user');

//创建express实例
const app: Express = express();

const jwt = require('jsonwebtoken');
require('crypto').randomBytes(64).toString('hex')

export function generateAccessToken(username:any) {
    return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
}
//dotenv
require('dotenv').config();

const port: any = process.env.PORT || 4000;

//导入body-parser模块
const bodyParser: any = require('body-parser');

//joson parser for post requests
app.use(express.json());

app.use(router);

//静态资源目录 app.use(express.static('public')); 可以访问位于 public 目录中的文件
app.use('/public', express.static(path.resolve(__dirname, 'public')));

// parse application/x-www-form-urlencoded 中间价
const  urlencodedParser: Express = app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
const jsonParser: Express = app.use(bodyParser.json());

// //filesystem: 提供本地文件的读写能力
// const fs: any = require('fs');

//Multer 是一个 node.js 中间件，用于处理 multipart/form-data 类型的表单数据
// var multer:any = require("multer");

// //create Folder
// var createFolder: any = function (folder: any) {
// 	try {
// 		fs.accessSync(folder);
// 	}catch (e) {
// 		fs.mkdirSync(folder);
// 	}
// };

app.listen(port, () => {
console.log(`Server running at http://localhost:${port}...`);
});




//https://www.digitalocean.com/community/tutorials/nodejs-jwt-expressjs




