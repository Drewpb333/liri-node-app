require("dotenv").config();
var fs = require("fs");
var request = require("request");
var keys = require("./keys.js");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var randomFile = "./random.txt";
var log = "./log.txt";
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
var action = process.argv[2];

//appends action to log.txt
fs.appendFile(log, action + ",", function (err) {
    if (err) {
        console.log(err);
    } else {
        if (process.argv[3]) {
            var itemName = movieOrSongNameJoin();
            fs.appendFile(log, itemName + "\n");
        }
    }
})

//joins multiple array values into one movie or song string
function movieOrSongNameJoin() {
    if (process.argv[3]) {
        var i = 3;
        var media = [];
        while (process.argv[i]) {
            media.push(process.argv[i]);
            i++
        }
        return media.join(" ");
    } else {
        return "";
    }
}

function myTweets() {
    var params = {
        screen_name: 'nodejs'
    };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            console.log(tweets);
        }
    });
}

//if more than one artist
function multipleArtists(song) {
    var artistsArray = [];
    song.artists.forEach(function (artist) {
        artistsArray.push(artist.name);
    })
    return artistsArray.join(", ");
}

function spotifyThisSong(name) {
    spotify.search({
        type: "track",
        query: name
    }, function (err, data) {
        if (err) {
            return console.log("Error ocurred: " + err);
        }
        var firstResult = data.tracks.items[0];
        console.log(multipleArtists(firstResult));
        console.log(firstResult.name);
        console.log(firstResult.preview_url);
        console.log(firstResult.album.name);
    })

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
function doWhatItSays() {
    fs.readFile(randomFile, "utf8", function (err, data) {
        if (err) {
            console.log(err);
        } else {
            var randomArray = data.split(",");
            var actionFromRandom = randomArray[0];
            var songOrMovieName = randomArray[1];
            switch (actionFromRandom) {
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
        }
    })
}


switch (action) {
    case "my-tweets":
        myTweets();
        break;
    case "spotify-this-song":
        var songName = movieOrSongNameJoin();
        if (!songName) {
            songName = "The Sign Ace of Base";
        }
        spotifyThisSong(songName);
        break;
    case "movie-this":
        var movieName = movieOrSongNameJoin();
        movieQuery(movieName);
        break;
    case "do-what-it-says":
        doWhatItSays();
        break;
    default:
        console.log("Please enter one of the following commands:\nmy-tweets\nspotify-this-song\nmovie-this\ndo-what-it-says");
}