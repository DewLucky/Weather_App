require('dotenv').config
const express = require("express");
const https = require("https");   
const bodyParser = require("body-parser");
const app = express();
require('dotenv').config();
const path = require('path')
const axios = require('axios');

app.use(express.static(path.join(__dirname, 'public')))

app.set('view engine', 'ejs');
const API_KEY = process.env.API_KEY;

// body parser to read read from form submission 
app.use(bodyParser.urlencoded({extended:true}));

// handling get request
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
})

// handling post request
app.post("/", async (req, res) => {
    const query = req.body.cityName;
    const unit = "metric";
    const appKey = `${API_KEY}`;
    let url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&units=" + unit + "&appid="+ appKey + "";

    
    // using axios as it easier to catch error in axios than in https.get
    try {
		const response = await axios({
			url: url,
			method: "get",
		});
		    const weatherData = await response.data;
            const temp = weatherData.main.temp;
            const city = weatherData.name;
            const icon = weatherData.weather[0].icon;
            const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
            const description = weatherData.weather[0].description;
            res.render('report', {temperature: temp, imgUrl: imageURL, descrpt: description, cityName: city});
	} catch (err) {
        res.status(500).render('error', {errorMessage: err});
	}   
})

// listen to server at provided port 
app.listen(process.env.PORT, function () {
    console.log("server started");
})

