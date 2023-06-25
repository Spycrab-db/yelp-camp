const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const CampGround = require("../models/camp-ground");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");

try {
    mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp').then(() => {
        console.log("DATABASE CONNECTED");
    })
} catch (e) {
    console.log("ERROR CONNECTING TO MONGODB");
    console.log(e);
}

//Gets a random element from an array
function arrRand(array) {
    return array[Math.floor(Math.random() * array.length)];
}

async function seedDB() {
    await CampGround.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new CampGround({
            title: `${arrRand(descriptors)} ${arrRand(places)}`,
            image: "http://source.unsplash.com/collection/483251",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Id corporis aliquid reiciendis, assumenda ad, alias molestiae facere dolorum sunt tenetur perferendis voluptas odio, vitae nostrum distinctio asperiores ratione impedit ab! Quod ex libero quidem repellat laboriosam obcaecati cupiditate, ipsam expedita voluptatum praesentium in autem suscipit maiores, explicabo eaque sint impedit, architecto quaerat nobis. Vel impedit minima et beatae corrupti natus!",
            price,
            author: '6495f435587977928054f697'
        });
        await camp.save();
    }
}

seedDB()
    .then(() => {
        mongoose.connection.close();
    })