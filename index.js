
const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const path = require("path");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/public", express.static("public"));

app.get("/", (req, res) => {
  res.render("index", { weatherData: null }); // Pass null as weatherData initially
});

app.post("/", async (req, res) => {
  try {
    const location = req.body.city;
    console.log(location);
    const fetch = await import("node-fetch");
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.APIKEY}`;
    const response = await fetch.default(url);
    const weatherData = await response.json();
    console.log(weatherData);

    const tempInKelvin = weatherData.main.temp;
    const tempInCelsius = Math.floor(tempInKelvin - 273.15); // Convert from Kelvin to Celsius

    const disc = weatherData.weather[0].description;
    const icon = weatherData.weather[0].icon;
    const imageUrl = `https://openweathermap.org/img/wn/${icon}.png`;

    res.render("index", { weatherData: { location, temp: tempInCelsius, disc, imageUrl } });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error retrieving weather data");
  }
});

const port = 3050;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
