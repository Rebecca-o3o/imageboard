const express = require('express');
const app = express();

const dbQuery = require('./database');

app.use(express.static(__dirname + '/public'));

// app.use(require('body-parser').urlencoded({
//     extended: false
// }));
//bodyparser.json

app.get('/home', function(req, res){

    return dbQuery.displayImages().then((result)=>{
        console.log(result.rows);
        res.json(result);
    }).catch((err)=>{
        console.log(err);
    });
});


app.listen(8080, ()=> console.log('Server listening on port 8080'));
