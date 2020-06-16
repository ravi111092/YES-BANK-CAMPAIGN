const bcrypt = require('bcryptjs');
const saltRounds = 10;
const path = require('path');
const auth = require("../services/auth");
const mail = require("../services/mail");
const services = require('../doa/services');
var uuid = require("uuid/v4")


// set general console.log color
const FgRed = "\x1b[31m%s\x1b[0m";
const FgGreen = "\x1b[32m%s\x1b[0m";
const FgYellow = "\x1b[33m%s\x1b[0m";
const FgMagenta = "\x1b[35m%s\x1b[0m";
const FgCyan = '\x1b[36m%s\x1b[0m';

const platform_users_collection = "platform_users"
const test_email = "iictest05@gmail.com"

module.exports = {

    // functions to manipulate user data.

    async login(req, res, next) {
        console.log(FgMagenta, "login()");
        try {
            var errors = [];
            // get the user info from the body
            var user_hash = {
                email: req.body.email,
                password: req.body.password
            }

            //validation  
            if (!user_hash.email) errors.push({ message: "Email is required." })
            if (!user_hash.password) errors.push({ message: "Password is required." })

            if (errors.length != 0) return next({ errors })

            // check if user is already present
            var query = `Select * from ` + platform_users_collection + ` where email="` + user_hash.email + `"`;
            var users = await services.query(query);
            var user = users.length != 0 ? users[0] : null;
            if (!user) throw new Error("User with email " + user_hash.email + " not registered.")

            // check password                
            bcrypt.compare(user_hash.password, user.password, async function (err, isEqual) {
                if (err) return next({ errors: [{ message: err.toString() }] });
                if (!isEqual) return next({ errors: [{ message: "Invalid password." }] });
                var auth_token = await auth.encoded(user_hash);
                delete user.password
                res.status(200).send({ status: true, success: "Login successfully.", info: { auth_token, user } })
            });
        } catch (err) {
            console.log(FgRed, "login() | " + err.toString());
            next({ errors: [{ message: err.toString() }] })
        }
    },
    
    async get_account(req, res, next) {
        console.log(FgMagenta, "get_account()");
        try {
            res.status(200).send({ status: true, success: "User account found.", info: { user: req.user } })
        } catch (err) {
            console.log(FgRed, "get_account() | " + err.toString());
            next({ errors: [{ message: err.toString() }] })
        }
    },
    
}



