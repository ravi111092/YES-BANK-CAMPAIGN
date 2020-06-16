const path = require('path');
const multer = require("../services/multer");
const services = require('../doa/services');
var yesbank_campaign_pool = require('../db_connect/my_sql_pool').yesbank_campaign_pool;


// set general console.log color
const FgRed = "\x1b[31m%s\x1b[0m";
const FgGreen = "\x1b[32m%s\x1b[0m";
const FgYellow = "\x1b[33m%s\x1b[0m";
const FgMagenta = "\x1b[35m%s\x1b[0m";
const FgCyan = '\x1b[36m%s\x1b[0m';

const users_collection = "users";
const users_collection_temp = "users_temp";
const stories_collection = "stories";
const stories_collection_temp = "stories_temp";
const story_images_folder = "story_images";
const story_images_folder_temp = "story_images_temp";

const start_transaction = 'START TRANSACTION';
const commit_trasaction = 'COMMIT';
const rollback_transaction = 'ROLLBACK';

module.exports = {

    // functions to manipulate story data.
    async add_story(req, res, next) {
        console.log(FgMagenta, "add_story()");
        try {
            var errors = [];
            // get the user info from the body
            var story_hash = {
                description: req.body.description, // *
                name: req.body.name, // *
                image: null, // one image *
                email: req.body.email,
                session_id: req.body.session_id
            }

            //validation        
            if (!story_hash.description) errors.push({ message: "Story description is required." });
            if (!story_hash.name) errors.push({ message: "Woman name is required." });
            if (!story_hash.email) errors.push({ message: "Email is required." });

            if (errors.length != 0) {
                multer.remove_temp_dir();
                return next({ errors });
            }

            // console.log(story_hash, null, 2);

            // create dir for the images            
            var image_dir = path.join(__dirname, "../public/" + story_images_folder + "/");
            // console.log("image_dir: " + image_dir);
            await multer.mkdirSync(image_dir);


            var image_files = (req.files['files'] && req.files['files'].length != 0) ? req.files['files'] : [];
            if (image_files.length == 0) story_hash.image = "";

            // single files           
            if (image_files && image_files.length != 0) {
                await multer.moveFileSync(image_files[0].path, image_dir + image_files[0].filename);
                story_hash.image = image_files[0].filename;
            }

            var query = `
                    INSERT INTO `+ stories_collection + ` (
                        description,
                        name,
                        image,
                        email,
                        is_hidden,
                        session_id,
                        created_at)
                        VALUES (
                        "`+ story_hash.description + `",
                        "`+ story_hash.name + `",
                        "`+ story_hash.image + `",
                        "`+ story_hash.email + `",
                        `+ true + `,
                        "`+ story_hash.session_id + `",
                        `+ yesbank_campaign_pool.escape(new Date()) + `);
                    `;
            await services.query(query);
            res.status(200).send({ status: true, success: "Story added successfully." });
            multer.remove_temp_dir();
        } catch (err) {
            multer.remove_temp_dir();
            console.log(err);
            console.log(FgRed, "add_story() | " + err.toString());
            next({ errors: [{ message: err.toString() }] })
        }
    },

    async add_story_temp(req, res, next) {
        console.log(FgMagenta, "add_story_temp()");
        try {
            var errors = [];
            // get the user info from the body
            var story_hash = {
                description: req.body.description, // *
                name: req.body.name, // *
                image: null, // one image *
                email: req.body.email,
                session_id: req.body.session_id
            }

            //validation        
            if (!story_hash.session_id) errors.push({ message: "Story session id is required." });

            if (errors.length != 0) {
                multer.remove_temp_dir();
                return next({ errors });
            }

            // console.log(story_hash, null, 2);

            // create dir for the images            
            var image_dir = path.join(__dirname, "../public/" + story_images_folder_temp + "/");
            // console.log("image_dir: " + image_dir);
            await multer.mkdirSync(image_dir);


            var image_files = (req.files && req.files['files'] && req.files['files'].length != 0) ? req.files['files'] : [];
            if (image_files.length == 0) story_hash.image = "";

            // single files           
            if (image_files && image_files.length != 0) {
                await multer.moveFileSync(image_files[0].path, image_dir + image_files[0].filename);
                story_hash.image = image_files[0].filename;
            }

            var query = `Select * from ` + stories_collection_temp + ` where session_id = "` + story_hash.session_id + `"`;
            var is_session = await services.query(query);

            if (is_session) {
                // update
                query = `UPDATE ` + stories_collection_temp + ` 
                SET description = "`+ story_hash.description + `", 
                name = "`+ story_hash.name + `",
                image = "`+ story_hash.image + `",
                email = "`+ story_hash.email + `" 
                where session_id = "` + story_hash.session_id + `"`;
                await services.query(query);
            } else {
                // insert
                query = `
                INSERT INTO `+ stories_collection_temp + ` (
                    description,
                    name,
                    image,
                    email,
                    is_hidden,
                    session_id,
                    created_at)
                    VALUES (
                    "`+ story_hash.description + `",
                    "`+ story_hash.name + `",
                    "`+ story_hash.image + `",
                    "`+ story_hash.email + `",
                    `+ false + `,
                    "`+ story_hash.session_id + `",
                    `+ yesbank_campaign_pool.escape(new Date()) + `);
                `;
                await services.query(query);
            }
            res.status(200).send({ status: true, success: "Story session added successfully." });
            multer.remove_temp_dir();
        } catch (err) {
            multer.remove_temp_dir();
            console.log(err);
            console.log(FgRed, "add_story_temp() | " + err.toString());
            next({ errors: [{ message: err.toString() }] })
        }
    },

    async get_all_stories(req, res, next) {
        console.log(FgMagenta, "get_all_stories()");
        try {
            var query = `Select * from ` + stories_collection + ` where is_hidden = ` + false;
            var stories = await services.query(query);
            res.status(200).send({ status: true, success: "Stories found.", info: { stories } });
        } catch (err) {
            console.log(err);
            console.log(FgRed, "get_all_stories() | " + err.toString());
            next({ errors: [{ message: err.toString() }] })
        }
    },
    
    async add_story_V2(req, res, next) {
        console.log(FgMagenta, "add_story_V2()");
        try {
            var errors = [];
            // get the user info from the body
            var story_hash = {
                full_name: req.body.full_name,
                email: req.body.email,
                phone_number: req.body.phone_number,
                is_yes_bank_customer: req.body.is_yes_bank_customer,
                referral_code: req.body.referral_code,
                session_id: req.body.session_id,
                description: req.body.description, // *
                name: req.body.name, // *
                image: null // one image *                
            }

            console.log(JSON.stringify(story_hash, null, 2))

            //validation
            if (!story_hash.full_name) errors.push({ message: "Full name is required." });
            if (!story_hash.email) errors.push({ message: "Email is required." });
            if (!story_hash.phone_number) errors.push({ message: "Phone number is required." });
            if (story_hash.is_yes_bank_customer == undefined) errors.push({ message: "Is Yes Bank customer is required." });
            else if (story_hash.is_yes_bank_customer != true && story_hash.is_yes_bank_customer != "true" && story_hash.is_yes_bank_customer != false && story_hash.is_yes_bank_customer != "false") errors.push({ message: "Is Yes Bank customer is invalid." });
            if (!story_hash.description) errors.push({ message: "Story description is required." });
            if (!story_hash.name) errors.push({ message: "Woman name is required." });

            if (errors.length != 0) {
                multer.remove_temp_dir();
                return next({ errors });
            }

            // console.log(story_hash, null, 2);

            // create dir for the images            
            var image_dir = path.join(__dirname, "../public/" + story_images_folder + "/");
            // console.log("image_dir: " + image_dir);
            await multer.mkdirSync(image_dir);


            var image_files = (req.files['files'] && req.files['files'].length != 0) ? req.files['files'] : [];
            if (image_files.length == 0) story_hash.image = "";

            // single files           
            if (image_files && image_files.length != 0) {
                await multer.moveFileSync(image_files[0].path, image_dir + image_files[0].filename);
                story_hash.image = image_files[0].filename;
            }





            // with session_id
            // var query = `
            // INSERT INTO `+ users_collection + ` (
            //     full_name,                        
            //     email,
            //     phone_number,                
            //     is_yes_bank_customer,  
            //     referral_code,
            //     session_id,
            //     created_at)
            //     VALUES (
            //     "`+ story_hash.full_name + `",
            //     "`+ story_hash.email + `",
            //     "`+ story_hash.phone_number + `",
            //     `+ story_hash.is_yes_bank_customer + `,
            //     "`+ story_hash.referral_code + `",
            //     "`+ story_hash.session_id + `",
            //     `+ yesbank_campaign_pool.escape(new Date()) + `);
            // `;
            // await services.query(query);

            // query = `
            // INSERT INTO `+ stories_collection + ` (
            //     description,
            //     name,
            //     image,
            //     email,
            //     is_hidden,
            //     session_id,
            //     created_at)
            //     VALUES (
            //     "`+ story_hash.description + `",
            //     "`+ story_hash.name + `",
            //     "`+ story_hash.image + `",
            //     "`+ story_hash.email + `",
            //     `+ true + `,
            //     "`+ story_hash.session_id + `",
            //     `+ yesbank_campaign_pool.escape(new Date()) + `);
            // `;
            // await services.query(query);

            // without session_id

            var query = `
            INSERT INTO `+ users_collection + ` (
                full_name,                        
                email,
                phone_number,                
                is_yes_bank_customer,  
                referral_code,                
                created_at)
                VALUES (
                "`+ story_hash.full_name + `",
                "`+ story_hash.email + `",
                "`+ story_hash.phone_number + `",
                `+ story_hash.is_yes_bank_customer + `,
                "`+ story_hash.referral_code + `",                
                `+ yesbank_campaign_pool.escape(new Date()) + `);
            `;
            await services.query(query);

            query = `
            INSERT INTO `+ stories_collection + ` (
                description,
                name,
                image,
                email,
                is_hidden,                
                created_at)
                VALUES (
                "`+ story_hash.description + `",
                "`+ story_hash.name + `",
                "`+ story_hash.image + `",
                "`+ story_hash.email + `",
                `+ true + `,                
                `+ yesbank_campaign_pool.escape(new Date()) + `);
            `;
            await services.query(query);

            res.status(200).send({ status: true, success: "Story added successfully." });
            multer.remove_temp_dir();
        } catch (err) {
            multer.remove_temp_dir();
            console.log(err);
            console.log(FgRed, "add_story_V2() | " + err.toString());
            next({ errors: [{ message: err.toString() }] })
        }
    },
    
    async add_story_V2_temp(req, res, next) {
        console.log(FgMagenta, "add_story_V2_temp()");
        try {
            var errors = [];
            // get the user info from the body
            var story_hash = {
                full_name: req.body.full_name,
                email: req.body.email,
                phone_number: req.body.phone_number,
                is_yes_bank_customer: req.body.is_yes_bank_customer,
                referral_code: req.body.referral_code,
                session_id: req.body.session_id,
                description: req.body.description, // *
                name: req.body.name, // *
                image: null // one image *                
            }


            //validation
            if (!story_hash.session_id) errors.push({ message: "Session id is required." });

            if (errors.length != 0) {
                multer.remove_temp_dir();
                return next({ errors });
            }

            // console.log(story_hash, null, 2);

            // create dir for the images            
            var image_dir = path.join(__dirname, "../public/" + story_images_folder + "/");
            // console.log("image_dir: " + image_dir);
            await multer.mkdirSync(image_dir);


            var image_files = (req.files['files'] && req.files['files'].length != 0) ? req.files['files'] : [];
            if (image_files.length == 0) story_hash.image = "";

            // single files           
            if (image_files && image_files.length != 0) {
                await multer.moveFileSync(image_files[0].path, image_dir + image_files[0].filename);
                story_hash.image = image_files[0].filename;
            }

            // users
            var query = `Select * from ` + users_collection_temp + ` where session_id = "` + story_hash.session_id + `"`;
            var is_session = await services.query(query);

            if (is_session) {
                // update
                query = `UPDATE ` + users_collection_temp + ` 
                SET full_name = "`+ story_hash.full_name + `", 
                email = "`+ story_hash.email + `",
                phone_number = "`+ story_hash.phone_number + `",
                is_yes_bank_customer = "`+ story_hash.is_yes_bank_customer + `",
                referral_code = "`+ story_hash.referral_code + `"                 
                where session_id = "` + story_hash.session_id + `"`;
                await services.query(query);
            } else {
                // insert
                query = `
                INSERT INTO `+ users_collection_temp + ` (
                    full_name,                        
                    email,
                    phone_number,                
                    is_yes_bank_customer,  
                    referral_code,
                    session_id,
                    created_at)
                    VALUES (
                    "`+ story_hash.full_name + `",
                    "`+ story_hash.email + `",
                    "`+ story_hash.phone_number + `",
                    `+ story_hash.is_yes_bank_customer + `,
                    "`+ story_hash.referral_code + `",
                    "`+ story_hash.session_id + `",
                    `+ yesbank_campaign_pool.escape(new Date()) + `);
                `;
                await services.query(query);
            }


            //stories
            query = `Select * from ` + stories_collection_temp + ` where session_id = "` + story_hash.session_id + `"`;
            is_session = await services.query(query);

            if (is_session) {
                // update
                query = `UPDATE ` + stories_collection_temp + ` 
                SET description = "`+ story_hash.description + `", 
                name = "`+ story_hash.name + `",
                image = "`+ story_hash.image + `",
                email = "`+ story_hash.email + `" 
                where session_id = "` + story_hash.session_id + `"`;
                await services.query(query);
            } else {
                // insert
                query = `
                INSERT INTO `+ stories_collection_temp + ` (
                    description,
                    name,
                    image,
                    email,
                    is_hidden,
                    session_id,
                    created_at)
                    VALUES (
                    "`+ story_hash.description + `",
                    "`+ story_hash.name + `",
                    "`+ story_hash.image + `",
                    "`+ story_hash.email + `",
                    `+ false + `,
                    "`+ story_hash.session_id + `",
                    `+ yesbank_campaign_pool.escape(new Date()) + `);
                `;
                await services.query(query);
            }
            res.status(200).send({ status: true, success: "Story (Temp) added successfully." });
            multer.remove_temp_dir();
        } catch (err) {
            multer.remove_temp_dir();
            console.log(err);
            console.log(FgRed, "add_story_V2_temp() | " + err.toString());
            next({ errors: [{ message: err.toString() }] })
        }
    },






}


