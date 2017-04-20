var TwitterPackage = require('twitter'),
    express = require('express'),
    app = express(),
    http = require('http'),
    server = http.createServer(app);

var mongoose = require('mongoose');
var Tweet = require("./models/tweet");

// importing my secret.json file
var secret = require("./secret");
server.listen(process.env.PORT || 3000);

//Create connexion BDD
mongoose.connect('mongodb://localhost:27017/nosqlesgi');

// create a new user called chris
var myTweet = new Tweet();

//make a new Twitter object : {'locations':'-180,-90,180,90'}
var twitter = new TwitterPackage(secret);
twitter.stream('statuses/filter', {track: '#France'},
    function(stream) {
        stream.on('data', function( tweet ) {
            var tweet_id = tweet.id_str;
            var tweet_text = tweet.text;
            var tweet_date = tweet.created_at;
            console.log(tweet);

            // Insert data into BDD (MongoDB)
            myTweet.result.push(tweet);
            myTweet.save(function(err) {
              if (err){
                console.log('Error error : ',err);
              }
                console.log('Tweet saved successfully!');
              });

        });

        stream.on('error', function ( error ) {
            console.error(error);
        });

    });
