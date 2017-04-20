var TwitterPackage = require('twitter'),
    express = require('express'),
    app = express(),
    http = require('http'),
    server = http.createServer(app);
var mongoose = require('mongoose');
var Tweet = require("./models/tweet");

var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var router = express.Router();

// importing my secret.json file
var secret = require("./secret");
var port = process.env.PORT || 3000;

app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);

//server.listen(process.env.PORT || 3000);

//Create connexion BDD
mongoose.connect('mongodb://localhost:27017/nosqlesgi');
var myTweet = new Tweet();

router.get('/', function(req, res) {
    // get all the users
    Tweet.find({}, function(err, tweets) {
      if (err) throw err;
      // object of all the users
      //console.log(tweets);
      res.json({ results: tweets });
    });

});

// create a new user called chris


//make a new Twitter object : {'locations':'-180,-90,180,90'}
var twitter = new TwitterPackage(secret);
twitter.stream('statuses/filter', {track: '#France'},
    function(stream) {
        stream.on('data', function( tweet ) {
            var tweet_id = tweet.id_str;
            var tweet_text = tweet.text;
            var tweet_date = tweet.created_at;
            //console.log(tweet);

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
