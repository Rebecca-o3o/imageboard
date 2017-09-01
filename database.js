//Spiced Academy module which sets up client to talk to DB from node.js
const spicedPg = require('spiced-pg');

//get database
const db = spicedPg(require('./secrets').db);
// const secrets = req uire('./secrets.json');
// const db = spicedPg(`postgres:${secrets.dbUser}:${secrets.pass}@localhost:5432/images`);

// get all images
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
var addImage = function(image, username, title, description){
    const queryText = 'INSERT INTO images (image, username, title, description) VALUES ($1, $2, $3, $4) RETURNING id';
    return db.query(queryText, [image, username, title, description]).then((result)=>{
        // console.log(result.rows[0]);
        return result.rows[0];
    }).catch((err)=>{
        console.log(err);
    });
};

// get selected img data
var viewImg = function(id){
    const format = "'Day, DD.Mon.YYYY HH24:MI'";
    const queryText = 'SELECT images.image, images.title, images.description, images.username, comments.author, comments.comment, to_char(comments.created_at,'+ format +') AS created_at\
        FROM images\
        LEFT JOIN comments\
        ON images.id = comments.image_id\
        WHERE images.id = $1\
        ORDER BY comments.created_at DESC NULLS LAST';
    return db.query(queryText, [id]).then((result)=>{
        // console.log(result);
        return result;
    }).catch((err)=>{
        console.log(err);
    });
};

module.exports = {
    displayImages,
    addImage,
    viewImg
};


// SELECT images.image, images.title, images.description, images.username, comments.author, comments.comment, comments.created_at FROM images LEFT JOIN comments ON images.id = comments.image_id WHERE images.id = 1 ORDER BY comments.created_at DESC NULLS LAST;
// SELECT images.image, images.title, images.description, images.username, comments.author, comments.comment, to_char(comments.created_at, 'Day, DD.Mon.YYYY HH24:MI') AS created_at FROM images LEFT JOIN comments ON images.id = comments.image_id WHERE images.id = 1 ORDER BY comments.created_at DESC NULLS LAST;
