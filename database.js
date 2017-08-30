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
        // console.log("Images:" + result.rows);
        return result.rows;
    }).catch((err)=>{
        console.log(err);
    });
};

//save images to db
var addImages = function(image, username, title, description){
    const queryText = 'INSERT INTO images (image, username, title, description) VALUES ($1, $2, $3, $4) RETURNING id';
    return db.query(queryText, [image, username, title, description]).then((result)=>{
        // console.log(result.rows[0]);
        return result.rows[0];
    }).catch((err)=>{
        console.log(err);
    });
};


module.exports = {
    displayImages,
    addImages
};
