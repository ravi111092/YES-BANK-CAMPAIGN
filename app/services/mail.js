"use strict";
const fs = require("fs");


const SENDGRID_API_KEY = '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';
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(SENDGRID_API_KEY);

const default_from = 'mumbai@inkincaps.com';

//handle bar for templatinging input
const handlebars = require('handlebars');
var readHTMLFile = function (path, callback) {
    fs.readFile(path, {
        encoding: 'utf-8'
    }, function (err, html) {
        if (err) {
            throw err;
            callback(err);
        } else {
            callback(null, html);
        }
    });
};


// set general console.log color
const FgRed = "\x1b[31m%s\x1b[0m";
const FgGreen = "\x1b[32m%s\x1b[0m";
const FgYellow = "\x1b[33m%s\x1b[0m";
const FgMagenta = "\x1b[35m%s\x1b[0m";
const FgCyan = '\x1b[36m%s\x1b[0m';

module.exports = {   

    sendMail(from, to, subject, html) {
        console.log(FgMagenta, 'Trying to send a mail to ' + to);
        return new Promise((resolve, reject) => {
            var mailOptions = {
                from: from ? from : default_from,
                to: to,
                subject: subject,
                html: html
            };
            sgMail.send(mailOptions, function (error, info) {
                if (error) {
                    console.log(FgRed, 'Unable to send email to ' + to + ' | ' + error);
                    resolve({ 'status': false, 'error': error, 'code': '500' })
                } else {
                    console.log(FgCyan, 'Email sent successfully to ' + to + ' | ' + info.response);
                    resolve({ 'status': true, 'code': '200' })
                }
            });
        });
    },

    get_html(html_path, replacements) {
        return new Promise((resolve, reject) => {
            readHTMLFile(html_path, function (err, html) {
                var template = handlebars.compile(html);
                html = template(replacements);
                resolve(html)
            });
        });
    },
}