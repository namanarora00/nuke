const nodemailer = require('nodemailer')

let EMAIL = 'recovery.nukeapp@gmail.com'
let PASSWORD = 'bits@123'

/**
 * Sends mail for password change.
 * @param  link  Link to the password change page 
 * @param  email  email of the user
 * @param  callback 
 */
function sendRecoveryMail(link, email, callback) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        host: "smtp.gmail.com",
        auth: {
            user: EMAIL,
            pass: PASSWORD
        }
    });

    text = "Hi. Click on the link below for instructions on changing your password.\n The link expires in 15 minutes\n"
    // ADD the frontend link

    var mailOptions = {
        from: EMAIL,
        to: email,
        subject: 'Password recovery.',
        text: text + link
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            throw new Error(error)
        } else {
            callback();
        }
    });
}

function testMail() {
    sendRecoveryMail("http://test.com", "xavier.arora@gmail.com", () => {
        console.log("done")
    })
}

// TODO: TESTING REQUIRED
testMail()

module.exports = sendRecoveryMail;