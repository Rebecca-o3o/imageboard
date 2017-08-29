const express = require('express');
const app = express();

const dbQuery = require('/database');

app.use(express.static(__dirname + '/public'));



app.get('/', function(req, res){
    dbQuery.displayImages().then((result)=>{
        console.log(result.rows);
        res.json(result);
    });
});


app.listen(8080, ()=> console.log('Server listening on port 8080'));
