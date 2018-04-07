require("dotenv").config();

var keys = require('./keys.js');
var Twitter = require('twitter');
var inquirer = require('inquirer');
var fs = require('fs');
var omdb = require('omdb');
var request = require('request');
var Spotify = require('node-spotify-api');

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

//prompting user what they want to do
inquirer.prompt([{
  type: 'list',
  message: 'What would you like to do?',
  choices: ['My Tweets', 'Spotify this Song', 'Movie This', 'Do What It Says'],
  name: 'whatToDo',
  //then take inquirerResponse and...
}]).then(function(inquirerResponse) {
  //if it is my tweets, display 20 most recent tweets
  if (inquirerResponse.whatToDo === 'My Tweets') {
    var params = {
      screen_name: 'rustyferrari',
      count: 20,
    };
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
      if (!error) {
        for (var i = 0; i < tweets.length; i++) {
          console.log(tweets[i].created_at);
          console.log(tweets[i].text);
        }
      }
    });
  }
  //if response is spotify this song, ask what song...
  if (inquirerResponse.whatToDo === 'Spotify this Song') {
    inquirer.prompt([{
      type: 'input',
      message: 'What song (title)?',
      name: 'whatSong',
      //then search for song...
    }]).then(function(inquirerResponse) {
      spotify.search({
        type: 'track',
        query: inquirerResponse.whatSong
      }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
        console.log(JSON.stringify(data.tracks.items[0].name, null, 2));
        console.log(JSON.stringify(data.tracks.items[0].album.artists[0].name, null, 2));
        console.log(JSON.stringify(data.tracks.items[0].external_urls.spotify, null, 2));
        console.log(JSON.stringify(data.tracks.items[0].album.name, null, 2));

      })
    })
  }
  //if response is movie this, omdb...
  if (inquirerResponse.whatToDo === 'Movie This') {
    inquirer.prompt([{
      type: 'input',
      message: 'What movie (title)?',
      name: 'whatMovie',
      //then search for movie...
    }]).then(function(inquirerResponse) {
      var noInput = inquirerResponse.whatMovie || "Mr+Nobody";
      var queryUrl = "http://www.omdbapi.com/?t=" + noInput + "&y=&plot=short&apikey=trilogy";
      request(queryUrl, function(error, response, body) {
        if (!error && response.statusCode === 200) {
          console.log('Title: ' + JSON.parse(body).Title);
          console.log('This film was made in: ' + JSON.parse(body).Year);
          console.log('IMDB Rating: ' + JSON.parse(body).imdbRating);
          console.log('Rotten Tomatoes Rating: ' + JSON.parse(body).Ratings[1].Value);
          console.log('Production Country: ' + JSON.parse(body).Country);
          console.log('Language: ' + JSON.parse(body).Language);
          console.log('Plot: ' + JSON.parse(body).Plot);
          console.log('Actors: ' + JSON.parse(body).Actors);
        }
      });
    })
  }
  //if response is do what it says...
  if (inquirerResponse.whatToDo === 'Do What It Says') {
    inquirer.prompt([{
      type: 'confirm',
      message: 'Are you SURE?',
      name: 'confirm',
      default: true,
    }]).then(function(inquirerResponse) {
      fs.readFile('random.txt', 'utf8', function(err, data) {
        spotify.search({
          type: 'track',
          query: data,
        }, function(err, data) {
          if (err) {
            return console.log('Error occurred: ' + err);
          }
          console.log(JSON.stringify(data.tracks.items[0].name, null, 2));
          console.log(JSON.stringify(data.tracks.items[0].album.artists[0].name, null, 2));
          console.log(JSON.stringify(data.tracks.items[0].external_urls.spotify, null, 2));
          console.log(JSON.stringify(data.tracks.items[0].album.name, null, 2));

        })
      });

    })
  }
});
