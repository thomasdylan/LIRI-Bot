require("dotenv").config();
const keys = require("./keys.js");
const Spotify = require('node-spotify-api');
const axios = require('axios');
const moment = require('moment');
const fs = require('fs');

const spotify = new Spotify(keys.spotify);

var nodeArg = process.argv;
var numArray = [];
for (var i = 3; i < nodeArg.length; i++) {
    numArray.push(nodeArg[i]);
}
numArray = numArray.join(" ")

var action = process.argv[2];
var value = numArray;


switch (action) {
    case 'concert-this':
        axios.get("https://rest.bandsintown.com/artists/" + value + "/events?app_id=codingbootcamp&date=upcoming")
            .then(function (response) {
                console.log("\n___________________________________________\n");
                for (var i = 0; i < response.data.length; i++) {
                    var concertData = response.data[i];
                    var formattedDate = moment(concertData.datetime).format('L');
                    console.log("Venue: " + JSON.stringify(concertData.venue.name) + "\n" +
                        "Venue Location: " + JSON.stringify(concertData.venue.city) + ", " + JSON.stringify(concertData.venue.region) + "\n" +
                        "Date: " + formattedDate + "\n___________________________________________\n");
                };
            }).catch(function (error) {
                console.log("An error has occured: " + error);
            });
        break;

    case 'spotify-this-song':
        if(!value) {
            value = "The Sign";
        }
        spotify
            .search({ type: 'track', query: value, limit: 5 })
            .then(function(response) {            
                for(var i = 0; i < response.tracks.items.length; i++) {
                    var album = response.tracks.items[i].album.name;
                    var artist = response.tracks.items[i].artists[0, 0].name;
                    var song = response.tracks.items[0].name;
                    var preview = response.tracks.items[i].preview_url;
                    console.log("Artist: " + artist + "\n" +
                                "Song: " + song + "\n" +
                                "Album: " + album + "\n" +
                                "Preview: " + preview + "\n___________________________________________\n");
                }
            })
            .catch(function(err) {
                console.log(err);
            })
        break;
    case 'movie-this':
        axios.get("http://www.omdbapi.com/?t=" + value + "&y=&plot=short&apikey=trilogy")
            .then(
                function (response) {
                    var movieData = response.data;
                    var imdb = movieData.Ratings[0].Value;
                    var rotten = movieData.Ratings[1].Value;
                    console.log("Title: " + movieData.Title + "\n" +
                                "Year: " + movieData.Year + "\n" +
                                "IMDB:  " + imdb + "\n" + 
                                "Rotten Tomatoes: " + rotten + "\n" +
                                "Country: " + movieData.Country + "\n" + 
                                "Language: " + movieData.Language + "\n" + 
                                "Plot: " + movieData.Plot + "\n" + 
                                "Actors: " + movieData.Actors + "\n");
                })
            .catch(function (error) {
                console.log(error);
            });
        break;
    case 'do-what-it-says':
        fs.readFile('random.txt', 'UTF-8', function(error, data) {
            if (error) {
                return console.log(error);
            }
            value = data;
        spotify
            .search({
                type: 'track',
                query: value,
                limit: 5
            })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (err) {
                console.log(err);
            });

        });
        break;
}