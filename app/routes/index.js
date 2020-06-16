"use strict";
const h = require("../helpers");
const doa_services = require("../doa/services");
const path = require('path');
const Handlebars = require('handlebars');
const fs=require('fs');

// set general console.log color
var FgRed = '\x1b[31m%s\x1b[0m';
var FgGreen = '\x1b[32m%s\x1b[0m';
var FgYellow = '\x1b[33m%s\x1b[0m';
var FgBlue = '\x1b[34m%s\x1b[0m';
var FgCyan = '\x1b[36m%s\x1b[0m';


module.exports = () => {

    let routes = {
        'get': {

            '': (req, res) => {
                res.render('index', { title: 'YES BANK' });
            },

            '/create_default_tables' : async (req, res) => {
                await doa_services.create_tables();
                res.status(200).send({ status: true, success: "Tables created." });
            },
            '/mosaic': (req, res) => {
                res.sendFile('mosaic.html', { root: path.join(__dirname, "../views") },)
            },
            '/share/:id': (req, res) => {
                var saved_data;
                var source = fs.readFileSync(path.join(__dirname, '../views/shared_page.hbs'), 'utf8');
                var template = Handlebars.compile(source);
                var storydata = fs.readFileSync(path.join(__dirname, '../mosaic/storiesupdated.json'), 'utf8');

                var id_array = fs.readFileSync(path.join(__dirname, '../mosaic/id.json'), 'utf8');
                var final_id_array = JSON.parse(id_array);
                // console.log(final_id_array);
                console.log("idarray : "+typeof final_id_array);
                console.log("params : "+typeof req.params.id)
                var verify = final_id_array.includes(parseInt(req.params.id))
                console.log("verify : "+verify)

               if(verify){
                
                var story_array = JSON.parse(storydata);
                for(var i = 0; i < story_array.length; i++){
                    if(req.params.id == story_array[i]._id){
                     saved_data = story_array[i];
                     res.send(template({ id:story_array[i]._id,name : story_array[i].name,description : story_array[i].description, image : story_array[i].image,}));
                    }
                }
               }else{
                   console.log("no")
                res.redirect('/404');
               }
                     
                    
            },
            '/search': (req, res) => {
                res.sendFile('search.html', { root: path.join(__dirname, "../views") },)
            },

        },
        'post': {
        }
    }
    return h.route(routes);
}