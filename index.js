const express = require('express');
const app = express();
const {s3Url} = require('./config.json');

const dbQuery = require('./database');

app.use(express.static(__dirname + '/public'));

// app.use(require('body-parser').urlencoded({
//     extended: false
// }));
//bodyparser.json

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
