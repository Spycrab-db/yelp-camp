const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const CampGround = require("../models/camp-ground");
const cities = require("./cities");
const { places, descriptors} = require("./seedHelpers");

try{
    mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp').then(()=>{
        console.log("DATABASE CONNECTED");
    })
} catch(e){
    console.log("ERROR CONNECTING TO MONGODB");
    console.log(e);
}

//Gets a random element from an array
function arrRand(array){
    return array[Math.floor(Math.random() * array.length)];
}

async function seedDB(){
    await CampGround.deleteMany({});
    for (let i = 0; i < 50; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new CampGround({
            title: `${arrRand(descriptors)} ${arrRand(places)}`,
            location: `${cities[random1000].city}, ${cities[random1000].state}`
        });
        await camp.save();
    }
}

seedDB()
.then(()=>{
    mongoose.connection.close();
})