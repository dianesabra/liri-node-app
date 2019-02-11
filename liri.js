require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var inquirer = require("inquirer");
var axios = require("axios");
var inspect = require("inspect");
var moment = require("moment");
var spotify = new Spotify(keys.spotify);
var fs = require("fs");

function movieThis(name) {
  axios
    .get("http://www.omdbapi.com/?t=" + name + "&y=&plot=short&apikey=trilogy")
    .then(function(response) {
      console.log(response);
      console.log("Title: " + response.data.Title);
      console.log("Year: " + response.data.Year);
      console.log("IMDB Rating: " + response.data.imdbRating);
      console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
      console.log("Language: " + response.data.Language);
      console.log("Plot: " + response.data.Plot);
      console.log("Cast: " + response.data.Actors);
    });
}

function spotifyThis(name) {
  spotify
    .search({ type: "track", query: name })
    .then(function(response) {
      console.log(response);
    })
    .catch(function(err) {
      console.log(err);
    });
}

function concertThis(artist) {
  axios
    .get(
      "https://rest.bandsintown.com/artists/" +
        artist +
        "/events?app_id=codingbootcamp"
    )
    .then(function(response) {
      console.log(response);
      if (response.data.length === 0) {
        console.log("There are no upcoming events.");
      } else {
        for (var i = 0; i < response.data.length; i++) {
          console.log("Venue Name: " + response.data[i].venue.name);
          console.log("Venue Location: " + response.data[i].venue.name); //??
          console.log(
            "Venue Name: " +
              moment(response.data[i].venue.datetime).format("MM/DD/YYYY")
          );
          console.log("--------------------");
        }
      }
    });
}

function surpriseMe() {
  fs.readFile("random3.txt", "utf8", function(error, data) {
    if (error) {
      return console.log(error);
    }
    var dataArr = data.split(",");
    var parameterValue = dataArr[1].split('"').join("");
    switch (dataArr[0]) {
      case "spotify-this-song":
        spotifyThis(parameterValue);
        break;
      case "concert-this":
        concertThis(parameterValue);
        break;
      case "movie-this":
        movieThis(parameterValue);
        break;
      default:
      // code block
    }
  });
}

inquirer
  .prompt([
    {
      type: "list",
      message: "What would you like to do?",
      choices: ["Concerts", "Spotify", "Movies", "Surprise Me"],
      name: "action"
    }
  ])
  .then(function(inquirerResponse) {
    switch (inquirerResponse.action) {
      case "Concerts":
        inquirer
          .prompt([
            {
              type: "text",
              message: "What artist would you like to look up?",
              name: "artistName"
            }
          ])
          .then(function(inquirerResponse) {
            if (inquirerResponse.artistName === "") {
              console.log("No artist was entered.");
            } else concertThis(inquirerResponse.artistName);
          });
        break;
      case "Spotify":
        inquirer
          .prompt([
            {
              type: "text",
              message: "What song would you like to look up?",
              name: "songName"
            }
          ])
          .then(function(inquirerResponse) {
            if (inquirerResponse.songName === "") {
              console.log("No song was entered.");
            } else spotifyThis(inquirerResponse.songName);
          });
        break;
      case "Movies":
        inquirer
          .prompt([
            {
              type: "text",
              message: "What movie would you like to look up?",
              name: "movieName"
            }
          ])
          .then(function(inquirerResponse) {
            if (inquirerResponse.movieName === "") {
              inquirerResponse.movieName = "Mr. Nobody";
            }
            movieThis(inquirerResponse.movieName);
          });
        break;
      case "Surprise Me":
        surpriseMe();
        break;
      default:
      // code block
    }
  });
