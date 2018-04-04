require("dotenv").config();

var keys = require('./keys.js');
var Twitter = require('twitter');
var inquirer = require('inquirer');
var omdb = require('omdb');
var request = require('request');
var Spotify = require('node-spotify-api');

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

// var input = (process.argv[2]);
//
// if (input === 'my-tweets') {
//   var params = {
//     screen_name: 'rustyferrari',
//     count: 20
//   };
//   client.get('statuses/user_timeline', params, function(error, tweets, response) {
//     if (!error) {
//       console.log(JSON.stringify(tweets, null, 2));
//     }
//   });
// };

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
      trim_user: true,
    };
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
      if (!error) {
        console.log(JSON.stringify(tweets, null, 2));
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
        console.log(data);
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
      var queryUrl = "http://www.omdbapi.com/?t=" + inquirerResponse.whatMovie + "&y=&plot=short&apikey=trilogy";
      omdb.search(queryUrl, function(err, movies) {

        if (err) {
          return console.error(err);
        }

        if (movies.length < 1) {
          return console.log('No movies found!');
        }

        movies.forEach(function(movie) {
          console.log('%s (%d)', movie.title, movie.year);
        });


      });

      // omdb.get({
      //   title: inquirerResponse.whatMovie
      // }, function(err, movie) {
      //   if (err) {
      //     return console.error(err);
      //   }
      //
      //   if (!movie) {
      //     return console.log('Movie not found!');
      //   }
      //
      //   console.log('%s (%d) %d/10', movie.title, movie.year, movie.imdb.rating);
      //   console.log(movie.plot);
      // })
    })
  }
});
