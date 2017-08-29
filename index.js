const express = require('express');
const app = express();
const {s3Url} = require('./config.json');

const dbQuery = require('./database');

//modules for img upload
const multer = require('multer');           // does chunks of huge files
const uidSafe = require('uid-safe');
const path = require('path');

var diskStorage = multer.diskStorage({
    // determining the path and filename to use when saving files
    destination: function (req, file, callback) {
        callback(null, __dirname + '/uploads');
    },
    filename: function (req, file, callback) {
        //use unique id as file name with original extension
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        filesize: 2097152       //(ca. 2MB) set a limit to prevent DOS attacks
    }
});

//static folder
app.use(express.static(__dirname + '/public'));

app.use(require('body-parser').urlencoded({
    extended: false
}));
// bodyparser.json


//route
app.get('/home', function(req, res){

    return dbQuery.displayImages().then((result)=>{
        // console.log("RESULT ROWS:" + result);
        var dbimages = result.map(function(item){
            item.image = s3Url+item.image;
            return item;
        });
        // console.log(dbimages);
        res.json({'images': dbimages});
    }).catch((err)=>{
        console.log(err);
    });
});


app.post('/upload', uploader.single('file'), function(req, res) {
    console.log(req.file);
    if (req.file) {
        res.json({
            success: true
        });
    } else {
        res.json({
            success: false
        });
    }
});

app.listen(8080, ()=> console.log('Server listening on port 8080'));
