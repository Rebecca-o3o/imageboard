const express = require('express');
const app = express();
const {s3Url} = require('./config.json');

const dbQuery = require('./database');

//modules for img upload
const multer = require('multer');           // does chunks of huge files
const uidSafe = require('uid-safe');
const path = require('path');

//AWS S3 client module
const knox = require('knox');



//require secrets for S3 client
let secrets;
if (process.env.NODE_ENV == 'production') {
    secrets = process.env; // in case of app being live
} else {
    secrets = require('./secrets');
}
//create S3 client
const client = knox.createClient({
    key: secrets.AWS_KEY,
    secret: secrets.AWS_SECRET,
    bucket: 'rkimageboard'
});


//upload files
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


//upload to AWS
function uploadToS3(req, res) {

    //create a request object with data from multer
    const s3Request = client.put(req.file.filename, {
        'Content-Type': req.file.mimetype,
        'Content-Length': req.file.size,
        'x-amz-acl': 'public-read'
    });

    const fs = require('fs');
    //readstream from file and pipe to to request
    const readStream = fs.createReadStream(req.file.path);
    readStream.pipe(s3Request);

    // check status of event after request finished
    s3Request.on('response', s3Response => {
        const wasSuccessful = s3Response.statusCode == 200;
        res.json({
            success: wasSuccessful
        });

        // update db only after success
        if(wasSuccessful) {
            dbQuery.addImage(req.file.filename,
                req.body.username,
                req.body.title,
                req.body.description);
        }
    });
}

//post incl. upload to AWS
app.post('/upload', uploader.single('file'), uploadToS3, function(req, res) {
    // console.log(req.file);
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


app.get('/image/:id', function(req, res){
    // console.log(req.params);
    var {id} = req.params;
    return dbQuery.viewImg(id).then((result)=>{

        // console.log(result);
        result.rows[0].image = s3Url+result.rows[0].image;
        // console.log(result.rows.length);
        // console.log(result.rows[0].image);

        var comments = {};

        // element[ yourKey ] = yourValue

        for (var i = 0; i < result.rows.length; i++) {
            comments[i] = {};
            comments[i].author = result.rows[i].author;
            comments[i].comment = result.rows[i].comment;
            comments[i].created_at = result.rows[i].created_at;

            // console.log(result.rows[i].author);
            // console.log(result.rows[i].comment);
            // console.log(result.rows[i].created_at);
        }

        console.log(comments);

        res.json({
            'image': result.rows[0],
            'comments': comments
        });
        // res.json({success: true});
    }).catch((err)=>{
        console.log(err);
        res.json({
            success: false
        });
    });
});


//post comment
app.post('/image/:id', function(req, res) {
    // console.log(req.params.id);
    // console.log(req.body.comment);
    // console.log(req.body.author);

    var id = req.params.id;
    var comment = req.body.comment;
    var author = req.body.author;

    dbQuery.addComment(id, author, comment).then(()=>{
        res.json({
            success: true
        });
    }).catch((err)=>{
        console.log(err);
    }
);
});

app.listen(8080, ()=> console.log('Server listening on port 8080'));
