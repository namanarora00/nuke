const nodemailer = require('nodemailer')

function sendRecoveryMail(link, email, callback) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 587,
        host: "smtp.gmail.com",
        secure: false,
        auth: {
            user: "recovery.nukeapp",
            pass: "bits@123"
        },
        requireTLS: true
    });

    text = "Hi. Click on the link below for instructions on changing your password.\n The link expires in 15 minutes\n"
    // ADD the frontend link

    if (process.env.NODE_ENV === "production")
        link = "https://shrouded-crag-47119.herokuapp.com/recover/" + link
    else
        link = "http://localhost:3000/recover/" + link;

    var mailOptions = {
        from: "recovery.nukeapp@gmail.com",
        to: email,
        subject: 'Password recovery.',
        text: text + link
    };
    console.log("sending email")
    transporter.sendMail(mailOptions, function (error, info) {
        if (callback) callback(error, info);
    });
}

module.exports = sendRecoveryMail;