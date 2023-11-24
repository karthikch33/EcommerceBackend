import nodemailer from 'nodemailer'
import asyncHandler from 'express-async-handler'

export  const sendEmail = asyncHandler(async (data,req,res)=>{
    let transporter = nodemailer.createTransport({
        host:"smtp.gmail.com",
        port: 587,
        secure:false,  // true for 465 false for other ports
        auth:{
            user : process.env.MAIL_ID,  // generated ethereal user
            pass : process.env.MAIL_PASSWORD  // generated ethereal password
        }
    })

    let info = await transporter.sendMail({
        from: `"Hey ${data?.firstname}" londonmumbai123@gmail.com"`,  // sender address
        to: data.to,  // list of receivers
        subject: data.subject, // Subject Line
        text: data.text, // plain text body
        html : data.htm // html body
    })

    console.log("Message Sent : %s",info.messageId)

    console.log("Preview Url: %s",nodemailer.getTestMessageUrl(info))

})