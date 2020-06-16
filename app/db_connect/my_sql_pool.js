const mysql = require('mysql');


// // development local
const yesbank_campaign_pool = mysql.createPool({    
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'admin@123',
    database: 'yes_bank_campaign_aug_2019',    
    connectionLimit: 50,
    insecureAuth: true,
});

// development
// const yesbank_campaign_pool = mysql.createPool({    
//     user: 'hSZ6OV99lH',
//     host: '37.59.55.185',
//     port: 3306,
//     password: 'DkACwUy4VB',
//     database: 'hSZ6OV99lH',    
//     connectionLimit: 50,
//     insecureAuth: true,
// });


// // production
// const yesbank_campaign_pool = mysql.createPool({    
//     host: 'localhost',
//     port: 3306,
//     user: 'yesbank',
//     password: 'v;klns@ywr!2',
//     database: 'celebrateher',    
//     connectionLimit: 50,
//     insecureAuth: true,
// });

// // production AWS
// const yesbank_campaign_pool = mysql.createPool({    
//     host: 'localhost',
//     port: 3306,
//     user: 'root',
//     password: 'inkincaps@1',
//     database: 'celebrateher',    
//     connectionLimit: 50,
//     insecureAuth: true,
// });

yesbank_campaign_pool.getConnection((err, con) => {
    if (err) {        
        // console.log("Unable to connect to MY SQL Database")
        console.log(err)
    } else {
        // console.log("Connected to MY SQL Database")        
        con.release();
    }
})


module.exports = {
    yesbank_campaign_pool
}