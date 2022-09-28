import { response } from "express"

//引入模块 nodemailer
 const nodemailer = require('nodemailer')

 const email = process.env.MAIL_USER
 const pass = process.env.MAIL_PASS

 // 创建一个SMTP客户端配置
 const config = {
	host: 'smtp.outlook.com',
    port: 587,
    secure: false,
	auth: {
		user: String(process.env.MAIL_USER), 
		pass: String(process.env.MAIL_PASS), //发件人邮箱的授权码
	}
 }
 //创建一个SMTP客户端配置对象
 const transporter = nodemailer.createTransport(config)

 //  发送邮件 调用transporter.sendMail(mail, callback)
export function sendMail (email: string, test: any) {
	 console.log("-------in sendMail-------")
	 //创建一个收件人对象
	 const mail = {
		from: String(process.env.MAIL_USER),
		subject: 'Camagru verification',
		to: email,
		html: test
	}
	console.log(email);
	console.log(pass);
	 transporter.sendMail(mail, (error: any, info: any) => {
		 if (error) {
			 return console.log(error)
		 }
		 transporter.close();
		 console.log('Message sent: %s', info.response)
	 })
}





