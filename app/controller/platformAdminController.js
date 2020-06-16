const bcrypt = require('bcryptjs');
const saltRounds = 10;
const path = require('path');
const auth = require("../services/auth");
const mail = require("../services/mail");
const services = require('../doa/services');
var uuid = require("uuid/v4")
var yesbank_campaign_pool = require('../db_connect/my_sql_pool').yesbank_campaign_pool;


// set general console.log color
const FgRed = "\x1b[31m%s\x1b[0m";
const FgGreen = "\x1b[32m%s\x1b[0m";
const FgYellow = "\x1b[33m%s\x1b[0m";
const FgMagenta = "\x1b[35m%s\x1b[0m";
const FgCyan = '\x1b[36m%s\x1b[0m';

const platform_users_collection = "platform_users";
const campaign_one_users = "users";
const campaign_one_stories = "stories";
const test_email = "iictest05@gmail.com";

module.exports = {

    // Users

    async add_user(req, res, next) {
        console.log(FgMagenta, "add_user()");
        try {
            var errors = [];
            // get the user info from the body
            var user_hash = {
                full_name: req.body.full_name,
                email: req.body.email,
                password: req.body.password
            }
            //validation            
            if (!user_hash.full_name) errors.push({ message: "Name is required." });
            if (!user_hash.email) errors.push({ message: "Email is required." });
            if (!user_hash.password) errors.push({ message: "Password is required." });

            if (errors.length != 0) return next({ errors });

            // check if user is already present
            var query = `Select * from ` + platform_users_collection + ` where email="` + user_hash.email + `"`;
            var users = await services.query(query);
            var user = users.length != 0 ? users[0] : null;
            if (user) throw new Error("User with email " + user_hash.email + " already registered.");

            // add new user                        
            bcrypt.genSalt(saltRounds, function (err, salt) {
                if (err) return next({ errors: [{ message: err.toString() }] })
                bcrypt.hash(user_hash.password, salt, async function (err, hash) {
                    if (err) return next({ errors: [{ message: err.toString() }] })
                    // store password in hash instead of plain password.
                    user_hash.password = hash;
                    query = `
                            INSERT INTO `+ platform_users_collection + ` (
                            full_name,
                            email,
                            password,
                            created_at)
                            VALUES (
                            "`+ user_hash.full_name + `",
                            "`+ user_hash.email + `",
                            "`+ user_hash.password + `",                
                            `+ yesbank_campaign_pool.escape(new Date()) + `);
                            `;
                    await services.query(query);
                    res.status(200).send({ status: true, success: "User added successfully." });
                });
            });
        } catch (err) {
            console.log(FgRed, "add_user() | " + err.toString());
            next({ errors: [{ message: err.toString() }] })
        }
    },

    // Campaign one    

    async get_campaign_one_users(req, res, next) {
        console.log(FgMagenta, "get_campaign_one_users()");
        try {
            var query = `Select * from ` + campaign_one_users;
            var users = await services.query(query);
            res.status(200).send({ status: true, success: "Campaign one users found.", info: { users } })
        } catch (err) {
            console.log(FgRed, "get_campaign_one_users() | " + err.toString());
            next({ errors: [{ message: err.toString() }] })
        }
    },

    async get_campaign_one_stories(req, res, next) {
        console.log(FgMagenta, "get_campaign_one_stories()");
        try {
            var query = `Select * from ` + campaign_one_stories;
            var stories = await services.query(query);
            res.status(200).send({ status: true, success: "Campaign one stories found.", info: { stories } })
        } catch (err) {
            console.log(FgRed, "get_campaign_one_stories() | " + err.toString());
            next({ errors: [{ message: err.toString() }] })
        }
    },

    async get_campaign_one_stories_by_email(req, res, next) {
        console.log(FgMagenta, "get_campaign_one_stories_by_email()");
        try {
            var errors = [];
            // get the user info from the body
            var story_hash = {
                email: req.body.email
            }
            //validation            
            if (!story_hash.email) errors.push({ message: "Story email is required." });

            if (errors.length != 0) return next({ errors });

            var query = `Select * from ` + campaign_one_stories + ` where email = "` + story_hash.email + `"`;
            var stories = await services.query(query);
            res.status(200).send({ status: true, success: "Campaign one stories found.", info: { stories } })
        } catch (err) {
            console.log(FgRed, "get_campaign_one_stories() | " + err.toString());
            next({ errors: [{ message: err.toString() }] })
        }
    },


    async toggle_campaign_one_story_status(req, res, next) {
        console.log(FgMagenta, "toggle_campaign_one_story_status()");
        try {
            var errors = [];
            // get the user info from the body
            var story_hash = {
                _id: req.body._id
            }
            //validation            
            if (!story_hash._id) errors.push({ message: "Story _id is required." });

            if (errors.length != 0) return next({ errors });

            // check if user is already present            
            var query = `Select * from ` + campaign_one_stories + ` where _id=` + story_hash._id + ``;
            var stories = await services.query(query);
            var story = stories.length != 0 ? stories[0] : null;
            if (!story) throw new Error("Story with _id " + story_hash._id + " not found.");
            var is_hidden = story.is_hidden ? true : false;
            // update story is_hidden
            query = `UPDATE ` + campaign_one_stories + ` SET is_hidden = ` + !is_hidden + ` where _id = ` + story_hash._id;
            await services.query(query);
            var success = is_hidden ? "Story un-hidden." : "Story hidden."
            res.status(200).send({ status: true, success });
        } catch (err) {
            console.log(FgRed, "toggle_campaign_one_story_status() | " + err.toString());
            next({ errors: [{ message: err.toString() }] })
        }
    },

    async get_campaign_one_users_with_stories(req, res, next) {
        console.log(FgMagenta, "get_campaign_one_users_with_stories()");
        try {
            var query = `SELECT users._id, users.email, users.full_name, users.phone_number, users.is_yes_bank_customer,users.referral_code, users.created_at, stories._id as story_id, stories.description as story_description, stories.image as story_image, stories.name as story_name, stories.is_hidden as story_is_hidden, stories.created_at as story_created_at FROM ` + campaign_one_users + ` LEFT JOIN stories ON users.email = stories.email WHERE stories.email is Not Null and stories.image != ''`;
            var users = await services.query(query);
           // console.log("userlist with stories:"+ users.length);
            res.status(200).send({ status: true, success: "Campaign one users with stories found.", info: { users } })
        } catch (err) {
            console.log(FgRed, "get_campaign_one_users_with_stories() | " + err.toString());
            next({ errors: [{ message: err.toString() }] })
        }
    },

    
    async get_campaign_one_users_without_stories(req, res, next) {
        console.log(FgMagenta, "get_campaign_one_users_without_stories()");
        try {
            var query = `SELECT users._id, users.email, users.full_name, users.phone_number, users.is_yes_bank_customer,users.referral_code, users.created_at FROM ` + campaign_one_users + ` LEFT JOIN stories ON users.email = stories.email WHERE stories.email is Null`;
            var users = await services.query(query);
            res.status(200).send({ status: true, success: "Campaign one users without stories found.", info: { users } })
        } catch (err) {
            console.log(FgRed, "get_campaign_one_users_without_stories() | " + err.toString());
            next({ errors: [{ message: err.toString() }] })
        }
    },

    


    // Service

    async query(req, res, next) {
        console.log(FgMagenta, "query()");
        try {
            var errors = [];
            // get the user info from the body
            var query_hash = {
                query: req.body.query
            }
            //validation            
            if (!query_hash.query) errors.push({ message: "Query is required." });
            if (errors.length != 0) return next({ errors });
            var result = await services.query(query_hash.query);
            res.status(200).send({ status: true, result });
        } catch (err) {
            console.log(FgRed, "query() | " + err.toString());
            next({ errors: [{ message: err.toString() }] })
        }
    },

}


