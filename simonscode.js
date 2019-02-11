var song = "Shallow";
require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

spotify
  .search({
    type: "track",
    query: song,
    limit: 1
  })
  .then(function(response) {
    console.log(response);
    var artist = response.album;

    console.log("Artist: " + artist);
  })
  .catch(function(err) {
    console.log(err);
  });
