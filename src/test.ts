require('dotenv').config()
import nodemailer from "nodemailer"
const mandrillTransport = require('nodemailer-mandrill-transport');

const MAIL_CHIMP_KEY = process.env.MAIL_CHIP_KEY

const smtpTransport = nodemailer.createTransport(mandrillTransport({
    auth: {
        apiKey : MAIL_CHIMP_KEY
    }
}));

async function main() {
    let mailOptions={
        from : 'chanaka@asiapropertyweb.com',
        to : 'chanaka@asiapropertyweb.com',
        subject : "This is from PWeb API",
        html : "Hello,<br>Sending this email using Node and Mandrill"
    };

    // Sending email.
    smtpTransport.sendMail(mailOptions, function(error, response){
        if(error) {
            throw new Error("Error in sending email");
        }
        console.log("Message sent: " + JSON.stringify(response));
    });
}

main().then().catch(e => console.log(e.message))