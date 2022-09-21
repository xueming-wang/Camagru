
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
		// 发件人邮箱账号
		user: String(process.env.MAIL_USER),
		//发件人邮箱的授权码
		pass: String(process.env.MAIL_PASS), 
	}
 }
 //创建一个SMTP客户端配置对象
 const transporter = nodemailer.createTransport(config)

 //  发送邮件 调用transporter.sendMail(mail, callback)
export async function sendMail (to: string) {
	 console.log("-------in sendMail-------")
	 //创建一个收件人对象
	 const mail = {
		// 发件人 邮箱  '昵称<发件人邮箱>'
		from: String(process.env.MAIL_USER),
		// 主题
		subject: 'Camagru verification',
		// 收件人的邮箱 
		to: to,
		//这里可以添加html标签
		html: `<h2>Camagru verification</h2><a href="http://localhost:3000/verify/${to}">Click here to verify your email</a>`
	}
	console.log(email);
	console.log(pass);
	 transporter.sendMail(mail, (error: any, info: any) => {
		 if (error) {
			 return console.log(error)
		 }
		 transporter.close()
		 console.log('Message sent: %s', info.messageId)
	 })
}

// module.exports = sendMail




