const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: 'iamsudhanshu.05@gmail.com',
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN
    },
    port: process.env.PORT,
    // host: 'localhost',
    tls: {
        rejectUnauthorized: false
    }
})

const sendWelcomeEmail = (email, name) => {
    const mailOptions = {
        from: 'iamsudhanshu.05@gmail.com',
        to: email,
        subject: 'Welcomeeee😁',
        text: `This is a welcome email, ${name}`
    }

    transporter.sendMail(mailOptions, (error, data) => {
        if(error) {
            return new Error(error)
        }
        return data
    })
}

const accountDeleteEmail = (email, name) => {
    const mailOptions = {
        from: 'iamsudhanshu.05@gmail.com',
        to: email,
        subject: 'Yo..Your Account Deleted😢',
        text: `yo..${name}, Yo!\nYour account has been deleeeted!`
    }

    transporter.sendMail(mailOptions, (error, data) => {
        if(error) {
            return new Error(error)
        }
        return data
    })
}

module.exports = { sendWelcomeEmail, accountDeleteEmail }