const nodemailer = require('nodemailer');

const enviadorEmail = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_POST,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,

    }
});

module.exports = { enviadorEmail };