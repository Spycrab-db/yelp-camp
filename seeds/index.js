const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const CampGround = require("../models/camp-ground");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");

if (process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/yelp-camp';
try {
    mongoose.connect(dbUrl).then(() => {
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
    for (let i = 0; i < 200; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const location = `${cities[random1000].city}, ${cities[random1000].state}`;
        const camp = new CampGround({
            title: `${arrRand(descriptors)} ${arrRand(places)}`,
            location,
            description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Id corporis aliquid reiciendis, assumenda ad, alias molestiae facere dolorum sunt tenetur perferendis voluptas odio, vitae nostrum distinctio asperiores ratione impedit ab! Quod ex libero quidem repellat laboriosam obcaecati cupiditate, ipsam expedita voluptatum praesentium in autem suscipit maiores, explicabo eaque sint impedit, architecto quaerat nobis. Vel impedit minima et beatae corrupti natus!",
            price,
            author: '66cf3c2fa3a24f44458825c8',
            images: [
                {
                  url: 'https://res.cloudinary.com/dbh56ykfb/image/upload/v1688146027/YelpCamp/tent_ifg8zl.jpg',
                  filename: 'YelpCamp/rbyhwxw5erts50e3lggm'
                },
                {
                  url: 'https://res.cloudinary.com/dbh56ykfb/image/upload/v1688146027/YelpCamp/campfire_rfu7dj.jpg',
                  filename: 'YelpCamp/hauq2yqdjeqmpg6ww76f',
                }
              ],
              geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
              }
        });
        await camp.save();
    }
}

seedDB()
    .then(() => {
        mongoose.connection.close();
    })