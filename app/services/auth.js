const jwt = require("jsonwebtoken")
const config = { secret: "yesbankcampaign2019" };
const services = require('../doa/services');
const platform_users_collection = "platform_users";

// set general console.log color
const FgRed = "\x1b[31m%s\x1b[0m";
const FgGreen = "\x1b[32m%s\x1b[0m";
const FgYellow = "\x1b[33m%s\x1b[0m";
const FgMagenta = "\x1b[35m%s\x1b[0m";
const FgCyan = '\x1b[36m%s\x1b[0m';

module.exports = {

    encoded(user) {
        return jwt.sign(
            {
                exp: (Math.floor(Date.now() / 1000) + (86400 * 31)),
                user,
            },
            config.secret,
        )
    },

    decoded(userJwt) {
        return jwt.verify(userJwt, config.secret, (error, res) => {
            if (error) {
                return { error }
            }
            return res
        })
    },

    async platform_autheticate(req, res, next) {
        // console.log(FgMagenta, "platform_autheticate()");
        try {
            // authenticate user 
            var auth_token = req.get("Authorization");
            if (!auth_token) return next({ errors: [{ message: "Authorization token required." }] });
            const userJwt = auth_token.slice("Bearer ".length)
            const userFromHeader = await module.exports.decoded(userJwt)
            var { error } = userFromHeader
            if (error) return next({ errors: [{ message: error.toString() }] });            
            var query = `Select * from ` + platform_users_collection + ` where email="` + userFromHeader.user.email + `"`;
            var users = await services.query(query);
            var user = users.length != 0 ? users[0] : null;
            if (!user) return next({ errors: [{ message: "User not found." }] });
            delete user.password;
            req.user = user;
            return next();
        } catch (err) {
            console.log(FgRed, "platform_autheticate() | " + err.toString());
            return next({ errors: [{ message: err.toString() }] })
        }
    },

}