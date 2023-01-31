const express = require("express");
const https = require("https");   
const bodyParser = require("body-parser");
const app = express();
require('dotenv').config();

app.set('view engine', 'ejs');
const API_KEY = process.env.API_KEY;

// body parser to read read from form submission 
app.use(bodyParser.urlencoded({extended:true}));

// handling get request
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
})

// handling post request
app.post("/", function (req, res) {
    const query = req.body.cityName;
    const unit = "metric";
    const appKey = `${API_KEY}`;
    let url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&units=" + unit + "&appid="+ appKey + "";

    // A native node module to make http request(here it is get request) to another server 
    https.get(url, function(response){
           
    response.on("data", function (data) {
        weatherData = JSON.parse(data);
        const temp = weatherData.main.temp;
        const city = weatherData.name;
        const icon = weatherData.weather[0].icon;
        const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
        const description = weatherData.weather[0].description;
        res.render('report', {temperature: temp, imgUrl: imageURL, descrpt: description, cityName: city});
    })
})
})

// listen to the server at port 3000
app.listen(3000, function () {
    console.log("server started");
})

