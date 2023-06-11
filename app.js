const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const app = express();

app.set('view engine', "ejs");
app.set('view', path.join(__dirname, 'views'));

app.get('/', (req, res)=>{
    
});

app.listen(3000, ()=>{
    console.log("LISTENING AT PORT 3000");
});

