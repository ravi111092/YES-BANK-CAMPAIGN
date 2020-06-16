var multer = require('multer');
const fs = require('fs-extra');
const uuidv4 = require('uuid/v4');
var path = require('path');

var tempDir = path.join(__dirname, './../public/temp');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir);
        }
        // console.log("tempDir: " + tempDir);
        cb(null, tempDir);
    },
    filename: function (req, file, cb) {
        var filename = file.fieldname + '-' + uuidv4() + '' + path.extname(file.originalname);        
        // console.log("filename: " + filename);        
        cb(null, filename);
    }
})

var upload = multer({ storage: storage, limits: { fileSize: 100 * 1024 * 1024 } });


var uploadFiles = upload.fields([
    { name: 'files', maxCount: 2 },
]);

function remove_temp_dir() {
    // remove file
    fs.removeSync(tempDir);
}

function mkdirSync(dir) {
    // console.log("dir: " + dir);
    var full_path = dir.split('\\');
    // console.log("full_path: " + full_path);
    for (var i = 1; i <= full_path.length; i++) {
        var segment = full_path.slice(0, i).join('/');
        // console.log("segment: " + segment);
        segment.length > 0 && !fs.existsSync(segment) ? fs.mkdirSync(segment) : null;
    }
    return true;
}

function removeSync(dir) {
    // remove file
    fs.removeSync(dir);
}

function copyFileSync(src_dir, dest_dir) {
    src_dir = src_dir ? src_dir : tempDir;
    // console.log("src_dir: " + src_dir);
    // console.log("dest_dir: " + dest_dir);
    fs.copyFileSync(src_dir, dest_dir);
    return true;
}

function moveFileSync(src_dir, dest_dir) {
    src_dir = src_dir ? src_dir : tempDir;
    // console.log("src_dir: " + src_dir);
    // console.log("dest_dir: " + dest_dir);
    fs.copyFileSync(src_dir, dest_dir);
    fs.removeSync(src_dir);
    return true;
}

function getFileNames(src_dir) {
    // read all the file names
    var files = [];
    fs.readdirSync(src_dir).forEach(file => {
        files.push(file);
    });
    return files;
}

module.exports = {    
    uploadFiles,    
    remove_temp_dir,
    mkdirSync,
    removeSync,
    copyFileSync,
    moveFileSync,
    getFileNames
}
