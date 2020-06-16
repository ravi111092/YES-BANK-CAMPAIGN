import 'zone.js/dist/zone-node';

import * as express from 'express';
import { join } from 'path';
import { enableProdMode } from "@angular/core";
// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

// Express server
const app = express();


// server code start

const FgRed = "\x1b[31m%s\x1b[0m";
const FgGreen = "\x1b[32m%s\x1b[0m";
const FgYellow = "\x1b[33m%s\x1b[0m";
const FgMagenta = "\x1b[35m%s\x1b[0m";
const FgCyan = '\x1b[36m%s\x1b[0m';


var cors = require('cors');
var bParser = require("body-parser");
var compression = require("compression");
var _default = require('./app');
const multer = require("./app/services/multer");
const auth = require("./app/services/auth");
const usersController = require("./app/controller/userController");
const storyController = require("./app/controller/storyController");
const platformUserController = require("./app/controller/platformUserController");
const platformAdminController = require("./app/controller/platformAdminController");

app.use(express.static("./public"));
app.use(express.static("./mosaic"));
app.use(cors());
app.options("*", cors());
app.use(bParser.json());
app.use(bParser.urlencoded({ extended: true }));
app.use(compression());



// Example Express Rest API endpoints
// app.get('/api/**', (req, res) => { });
app.get('/mosaic', _default.router);
app.get('/share/:id', _default.router);
app.get('/search', _default.router);
app.get('/create_default_tables', _default.router);
app.post('/users/registration', usersController.registration);
app.post('/stories/add_story', multer.uploadFiles, storyController.add_story);
app.post('/stories/add_story_V2', multer.uploadFiles, storyController.add_story_V2);
app.post('/stories/get_all_stories', storyController.get_all_stories);
app.post('/users/get_all_users_by_search', usersController.get_all_users_by_search);

// // Campaign One TEMP
// app.post('/users/registration_temp', usersController.registration_temp);
// app.post('/stories/add_story_temp', multer.uploadFiles, storyController.add_story_temp);

// platform users
app.post('/platform/login', platformUserController.login);
app.get('/platform/get_account', auth.platform_autheticate, platformUserController.get_account);
app.get('/platform/get_campaign_one_users', auth.platform_autheticate, platformAdminController.get_campaign_one_users);
app.get('/platform/get_campaign_one_users_with_stories', auth.platform_autheticate, platformAdminController.get_campaign_one_users_with_stories);
app.get('/platform/get_campaign_one_users_without_stories', auth.platform_autheticate, platformAdminController.get_campaign_one_users_without_stories);
app.get('/platform/get_campaign_one_stories', auth.platform_autheticate, platformAdminController.get_campaign_one_stories);
app.post('/platform/get_campaign_one_stories_by_email', auth.platform_autheticate, platformAdminController.get_campaign_one_stories_by_email);
app.post('/platform/toggle_campaign_one_story_status', auth.platform_autheticate, platformAdminController.toggle_campaign_one_story_status);


//Service
app.post('/query', auth.platform_autheticate, platformAdminController.query); // development

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log(err);
  res.status(200).send({ status: false, errors: err.errors });
});
// server code end


const PORT = process.env.PORT || 3000;
const DIST_FOLDER = join(process.cwd(), 'dist/browser');


// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const { AppServerModuleNgFactory, LAZY_MODULE_MAP, ngExpressEngine, provideModuleMap } = require('./dist/server/main');



// Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
app.engine('html', ngExpressEngine({
  bootstrap: AppServerModuleNgFactory,
  providers: [
    provideModuleMap(LAZY_MODULE_MAP)
  ]
}));

app.set('port', PORT);
app.set('view engine', 'html');
app.set('views', DIST_FOLDER);


app.get('*.*', express.static(DIST_FOLDER, {
  maxAge: '1y'
}));

// All regular routes use the Universal engine
app.get('*', (req, res) => {
  res.render('index', { req });
});



// connect to database
var db_mysql = require('./app/db_connect/my_sql_pool').yesbank_campaign_pool;
db_mysql.getConnection((err, con) => {
  if (err) {
    console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
    console.log(FgRed, "Unable to connect to MY SQL Database");
    console.log(err)
    console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
  } else {
    console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
    console.log(FgGreen, "Connected to MY SQL Database");
    con.release();
    app.listen(app.get('port'), function () {
      console.log('Server listening on = http://localhost:' + app.get('port'));
    });
  }
});