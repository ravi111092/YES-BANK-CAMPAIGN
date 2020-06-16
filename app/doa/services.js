var yesbank_campaign_pool = require('../db_connect/my_sql_pool').yesbank_campaign_pool;
const bcrypt = require('bcryptjs');
const saltRounds = 10;

// set general console.log color
const FgRed = "\x1b[31m%s\x1b[0m";
const FgGreen = "\x1b[32m%s\x1b[0m";
const FgYellow = "\x1b[33m%s\x1b[0m";
const FgMagenta = "\x1b[35m%s\x1b[0m";
const FgCyan = '\x1b[36m%s\x1b[0m';


module.exports = {

    // functions to manipulate database.

    query(query) {
        return new Promise(async function (resolve, reject) {
            // console.log(FgMagenta, "insert()")
            try {
                yesbank_campaign_pool.query(query, (err, data) => {
                    if (err) reject(err)
                    resolve(data)
                })
            } catch (err) {
                console.log(err)
                reject(err)
            }
        });
    },    

    async create_tables() {
        return new Promise(async function (resolve, reject) {
            // create table stories
            try {
                // ----------------------------------------------------------------------------------------
                // Campaign One

                // create table users
                var query = `CREATE TABLE IF NOT EXISTS users (
                _id int(11) NOT NULL AUTO_INCREMENT,
                full_name varchar(50) DEFAULT NULL,
                email varchar(50) DEFAULT NULL,
                phone_number varchar(25) DEFAULT NULL,
                is_yes_bank_customer tinyint(4) DEFAULT NULL,
                created_at datetime DEFAULT NULL,
                session_id varchar(255) DEFAULT NULL,
                referral_code varchar(45) DEFAULT NULL,
                PRIMARY KEY (_id)
                ) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4;`
                await module.exports.query(query);

                // create table stories
                query = `CREATE TABLE IF NOT EXISTS stories (
                _id int(11) NOT NULL AUTO_INCREMENT,
                description varchar(10000) NOT NULL,
                name varchar(255) NOT NULL,
                image varchar(255) NOT NULL,
                email varchar(50) NOT NULL,
                is_hidden tinyint(4) DEFAULT NULL,
                created_at datetime DEFAULT NULL,
                session_id varchar(255) DEFAULT NULL,
                PRIMARY KEY (_id)
                ) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;`
                await module.exports.query(query);



                // ----------------------------------------------------------------------------------------
                // Campaign Two
                // create table self
                query = `CREATE TABLE IF NOT EXISTS selfs (
                _id int(11) NOT NULL AUTO_INCREMENT,
                image varchar(255) NOT NULL,
                text varchar(50) NOT NULL,
                votes int(11) NOT NULL,
                is_hidden tinyint(4) DEFAULT NULL,                
                created_at datetime DEFAULT NULL,
                session_id varchar(255) DEFAULT NULL,
                PRIMARY KEY (_id)
                ) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;`
                await module.exports.query(query);


                // create table financially_free_answers
                query = `CREATE TABLE IF NOT EXISTS financially_free_answers (
                _id int(11) NOT NULL AUTO_INCREMENT,                
                text varchar(5000) NOT NULL,
                is_hidden tinyint(4) DEFAULT NULL,                
                created_at datetime DEFAULT NULL,
                session_id varchar(255) DEFAULT NULL,
                PRIMARY KEY (_id)
                ) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;`
                await module.exports.query(query);


                // create temp tables

                query = `CREATE TABLE IF NOT EXISTS users_temp (
                    _id int(11) NOT NULL AUTO_INCREMENT,
                    full_name varchar(50) DEFAULT NULL,
                    email varchar(50) DEFAULT NULL,
                    phone_number varchar(25) DEFAULT NULL,
                    is_yes_bank_customer tinyint(4) DEFAULT NULL,
                    created_at datetime DEFAULT NULL,
                    session_id varchar(255) DEFAULT NULL,
                    referral_code varchar(45) DEFAULT NULL,
                    PRIMARY KEY (_id)
                    ) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4;`
                await module.exports.query(query);

                // create table stories
                query = `CREATE TABLE IF NOT EXISTS stories_temp (
                    _id int(11) NOT NULL AUTO_INCREMENT,
                    description varchar(10000) NOT NULL,
                    name varchar(255) NOT NULL,
                    image varchar(255) NOT NULL,
                    email varchar(50) NOT NULL,
                    is_hidden tinyint(4) DEFAULT NULL,
                    created_at datetime DEFAULT NULL,
                    session_id varchar(255) DEFAULT NULL,
                    PRIMARY KEY (_id)
                    ) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;`
                await module.exports.query(query);



                // ----------------------------------------------------------------------------------------
                // Campaign Two
                // create table self
                query = `CREATE TABLE IF NOT EXISTS selfs_temp (
                    _id int(11) NOT NULL AUTO_INCREMENT,
                    image varchar(255) NOT NULL,
                    text varchar(50) NOT NULL,
                    votes int(11) NOT NULL,
                    is_hidden tinyint(4) DEFAULT NULL,                
                    created_at datetime DEFAULT NULL,
                    session_id varchar(255) DEFAULT NULL,
                    PRIMARY KEY (_id)
                    ) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;`
                await module.exports.query(query);


                // create table financially_free_answers
                query = `CREATE TABLE IF NOT EXISTS financially_free_answers_temp (
                    _id int(11) NOT NULL AUTO_INCREMENT,                
                    text varchar(5000) NOT NULL,
                    is_hidden tinyint(4) DEFAULT NULL,                
                    created_at datetime DEFAULT NULL,
                    session_id varchar(255) DEFAULT NULL,
                    PRIMARY KEY (_id)
                    ) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;`
                await module.exports.query(query);


                // ----------------------------------------------------------------------------------------
                // Admin
                query = `CREATE TABLE IF NOT EXISTS platform_users (
                _id int(11) NOT NULL AUTO_INCREMENT,
                full_name varchar(50) NOT NULL,
                email varchar(50) NOT NULL,
                password varchar(100) NOT NULL,
                created_at datetime DEFAULT NULL,
                PRIMARY KEY (_id)
                ) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;`
                await module.exports.query(query);

                // check if user is already present
                query = `Select * from platform_users where email="iictest05@gmail.com"`;
                var users = await module.exports.query(query);
                var user = users.length != 0 ? users[0] : null;
                if (!user) {
                    const password = "inkincaps@1";
                    bcrypt.genSalt(saltRounds, function (err, salt) {
                        if (err) resolve(false);
                        bcrypt.hash(password, salt, async function (err, hash) {
                            if (err) resolve(false);
                            // store password in hash instead of plain password.                            
                            query = `
                            INSERT INTO platform_users (
                            full_name,
                            email,
                            password,
                            created_at)
                            VALUES (
                            "IIC TEST05",
                            "iictest05@gmail.com",
                            "`+ hash + `",                
                            `+ yesbank_campaign_pool.escape(new Date()) + `);
                            `;
                            await module.exports.query(query);
                        });
                    });
                }

                resolve(true);
            } catch (err) {
                console.log(err);
                resolve(false);
            }
        });
    }

}