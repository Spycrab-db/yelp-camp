const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const CampGround = require("./models/camp-ground");

try{
    mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp').then(()=>{
        console.log("DATABASE CONNECTED");
    })
} catch(e){
    console.log("ERROR CONNECTING TO MONGODB");
    console.log(e);
}

app.set('view engine', "ejs");
app.set('view', path.join(__dirname, 'views'));

app.get('/', (req, res)=>{

});

app.listen(3000, ()=>{
    console.log("LISTENING AT PORT 3000");
});

