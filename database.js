//Spiced Academy module which sets up client to talk to DB from node.js
const spicedPg = require('spiced-pg');

//get database
const db = spicedPg(require('./secrets').db);
// const secrets = req uire('./secrets.json');
// const db = spicedPg(`postgres:${secrets.dbUser}:${secrets.pass}@localhost:5432/images`);

// get images
var displayImages = function(){
    const queryText = 'SELECT * FROM images';
    // conssole.log(queryText);
    return db.query(queryText).then((result)=>{
        console.log("Images:" + result.rows);
        return result.rows;
    }).catch((err)=>{
        console.log(err);
    });
};


module.exports = {
    displayImages
};
