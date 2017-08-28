const express = require('express');
const app = express();


app.use(express.static(__dirname + '/public'));


app.get('/home', function(req, res){
    res.send('router running');
});


app.listen(8080, ()=> console.log('Server listening on port 8080'));
