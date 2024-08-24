const nodemailer = require("nodemailer")


const sendEmail = async (req, res) => {
    // test Account 
    let testAccount = await nodemailer.createTestAccount()

    // get this code from ethereal
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'jermaine.schaefer@ethereal.email',
            pass: 'UGWcEMd4sPWjb3C34x'
        }
    });

    // let info = await transporter.sendEmail({
    //     from: '"Samruddh Patil" <sam@gmail.com>',
    //     to: 'bar@example.com',
    //     subject: 'Hello',
    //     html: '<h2>Sending Emails with Node.js</h2>',
    // })

    const info = await transporter.sendMail({
        from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // sender address
        to: "bar@example.com, baz@example.com", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>", // html body
    });

    res.json(info)
}


module.exports = sendEmail