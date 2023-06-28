const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const CampGround = require("../models/camp-ground");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocoder = mbxGeocoding({accessToken: 'pk.eyJ1Ijoic3B5Y3JhYi1kYiIsImEiOiJjbGpmM2VvMjgwZnQ0M3Jvd25ubHVtdHE4In0.SiRyoSLpiipvHn66_TusWw'});

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
        const location = `${cities[random1000].city}, ${cities[random1000].state}`;
        const geodata = await geocoder.forwardGeocode({
            query: location,
            limit: 1
        }).send()
        const camp = new CampGround({
            title: `${arrRand(descriptors)} ${arrRand(places)}`,
            location,
            description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Id corporis aliquid reiciendis, assumenda ad, alias molestiae facere dolorum sunt tenetur perferendis voluptas odio, vitae nostrum distinctio asperiores ratione impedit ab! Quod ex libero quidem repellat laboriosam obcaecati cupiditate, ipsam expedita voluptatum praesentium in autem suscipit maiores, explicabo eaque sint impedit, architecto quaerat nobis. Vel impedit minima et beatae corrupti natus!",
            price,
            author: '6495f435587977928054f697',
            images: [
                {
                  url: 'https://res.cloudinary.com/dbh56ykfb/image/upload/v1687896885/YelpCamp/rbyhwxw5erts50e3lggm.jpg',
                  filename: 'YelpCamp/rbyhwxw5erts50e3lggm'
                },
                {
                  url: 'https://res.cloudinary.com/dbh56ykfb/image/upload/v1687896886/YelpCamp/hauq2yqdjeqmpg6ww76f.jpg',
                  filename: 'YelpCamp/hauq2yqdjeqmpg6ww76f',
                }
              ],
              geometry: geodata.body.features[0].geometry
        });
        await camp.save();
    }
}

seedDB()
    .then(() => {
        mongoose.connection.close();
    })