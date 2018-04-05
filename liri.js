require("dotenv").config();
var fs = require("fs");
var request = require("request");
var keys = require("./keys.js");
var randomFile = "./random.txt";
var log = "./log.txt";
// var spotify = new Spotify(keys.spotify);
// var client = new Twitter(keys.twitter);
var action = process.argv[2];

//appends action to log.txt
fs.appendFile(log, "action", function(err){
    if(err){
        console.log(err);
    }
    else{
        if(process.argv[3]){
            var itemName = movieOrSongNameJoin();
            fs.appendFile(log, itemName);
        }
    }
})

//joins multiple array values into one movie or song string
function movieOrSongNameJoin() {
    var i = 3;
    var media = [];
    while (process.argv[i]) {
        media.push(process.argv[i]);
        i++
    }
    return media.join(" ");
}

function myTweets(){

}

function spotifyThisSong(name){

}

function movieQuery(name) {
    var queryUrl = "http://www.omdbapi.com/?t=" + name + "&y=&plot=short&apikey=trilogy";
    request(queryUrl, function (err, response, body) {
        if (err) {
            console.log(err);
        } else if (!err && response.statusCode === 200) {
            //trying to stick to DRY
            var parse = JSON.parse(body);
            console.log("Title: " + parse.Title);
            console.log("Year: " + parse.Year);
            console.log("IMDB Rating: " + parse.imdbRating);
            console.log("Rotten Tomatoes Rating: " + parse.Ratings[1]["Value"]);
            console.log("Produced in: " + parse.Country);
            console.log("Language: " + parse.Language);
            console.log("Plot: " + parse.Plot);
            console.log("Actors: " + parse.Actors);
        }
    })
}

// returns action and search query
function doWhatItSays(){
    fs.readFile(randomFile, "utf8", function (err, data) {
        if (err) {
            console.log(err);
        }
        else{
            var randomArray = data.split(",");
            return randomArray;
        }
    })
}

switch (action) {
    case "my-tweets":
        myTweets();
        break;
    case "spotify-this-song":
        var songName = movieOrSongNameJoin();
        spotifyThisSong(songName);
        break;
    case "movie-this":
        movieQuery();
        break;
    case "do-what-it-says":
        var infoFromRandom = doWhatItSays();
        var actionFromRandom = infoFromRandom[0];
        var songOrMovieName = infoFromRandom[1];
        switch (actionFromRandom){
            case "my-tweets":
                myTweets();
                break;
            case "spotify-this-song":
                spotifyThisSong(songOrMovieName);
                break;
            case "movie-this":
                movieQuery(songOrMovieName);
                break;
            case "do-what-it-says":
                console.log("N/A");
                break;
        }
        break;
    default:
        console.log("Please enter one of the following commands:\nmy-tweets\nspotify-this-song\nmovie-this\ndo-what-it-says");
}