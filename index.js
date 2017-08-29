const express = require('express');
const app = express();
const {s3Url} = require('./config.json');

const dbQuery = require('./database');

//modules for img upload
const multer = require('multer');
const uidSafe = require('uid-safe');
const path = require('path');

var diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/uploads');
    },
    filename: function (req, file, callback) {
      uidSafe(24).then(function(uid) {
          callback(null, uid + path.extname(file.originalname));
      });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        filesize: 2097152       //always set a limit!
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


app.listen(8080, ()=> console.log('Server listening on port 8080'));
