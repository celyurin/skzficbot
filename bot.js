// Dependencies =========================
/* var
    twit = require('twit'),
    config = require('./config');
 */
//var Twitter = new twit(config);
const twit = require("./twit");
const fs = require("fs");
const path = require("path");
const paramsPath = path.join(__dirname, "params.json");
const TWEETS_TO_REPLY = require('./fics');
const badQuery = require('./badquery-fics');
//var http = require('http');

// RETWEET BOT ==========================

// find latest tweet according the query 'q' in params
/* var retweet = function () {
    let params = {
        q: "@skzficbot"  // REQUIRED
    }


    Twitter.get('search/tweets', params, function (err, data) {
        // if there no errors
        if (!err) {
            // grab ID of tweet to reply
            console.log("datos que vienen");
            console.log(data.statuses)
            var retweetId = data.statuses[0].id_str;
            // Tell TWITTER to retweet
            Twitter.post('statuses/retweet/:id', {
                id: retweetId
            }, function (err, response) {
                if (response) {
                    console.log('Retweeted!!!');
                }
                // if there was an error while tweeting
                if (err) {
                    console.log('Something went wrong while RETWEETING... Duplication maybe...');
                }
            });
        }
        // if unable to Search a tweet
        else {
            console.log('Something went wrong while SEARCHING...');
        }
    });
}

// grab & retweet as soon as program is running...
retweet();
// retweet in every 50 minutes
setInterval(retweet, 10000); */
//http.createServer(function (request, response) {

    var pairing = [
      "🐰🐺", //chan
      "🐺🐰",
      "🐺🐇🐷",
      "🐇🐷🐺",
      "🐺🥟",
      "🥟🐺",
      "🐺🐿️",
      "🐿️🐺",
      "🐺🐥",
      "🐥🐺",
      "🐺🐶",
      "🐶🐺",
      "🐺🦊",
      "🦊🐺",
      "🐰🐇🐷", //minho
      "🐇🐷🐰",
      "🐰🥟",
      "🥟🐰",
      "🐰🐿️",
      "🐿️🐰",
      "🐰🐥",
      "🐥🐰",
      "🐰🐶",
      "🐶🐰",
      "🐰🦊",
      "🦊🐰",
      "🐇🐷🥟", //changbin
      "🥟🐇🐷",
      "🐇🐷🐿️",
      "🐿️🐇🐷",
      "🐇🐷🐥",
      "🐥🐇🐷",
      "🐇🐷🐶",
      "🐶🐇🐷",
      "🐇🐷🦊",
      "🦊🐇🐷",
      "🥟🐿️", //hyunjin
      "🐿️🥟",
      "🥟🐥",
      "🐥🥟",
      "🥟🐶",
      "🐶🥟",
      "🥟🦊",
      "🦊🥟",
      "🐿️🐥", //jisung
      "🐥🐿️",
      "🐿️🐶",
      "🐶🐿️",
      "🐿️🦊",
      "🦊🐿️",
      "🐥🐶", //felix
      "🐶🐥",
      "🐥🦊",
      "🦊🐥",
      "🐶🦊", //seungmin
      "🦊🐶"
    ];
  
    setInterval(main, 180000); //3 minutos por el límite de llamadas este
    
    function writeParams(data) {
      console.log("We are writing the params file ...", data);
      return fs.writeFileSync(paramsPath, JSON.stringify(data));
    }
  
    function readParams() {
      console.log("We are reading the params file ...");
      const data = fs.readFileSync(paramsPath);
      return JSON.parse(data.toString());
    }
  
    function getTweets(since_id) {
      return new Promise((resolve, reject) => {
        let params = {
          q: "@skzficbot"
        };
        if (since_id) {
          params.since_id = since_id;
        }
        console.log("We are getting the tweets ...", params);
        twit.get("search/tweets", params, (err, data) => {
          if (err) {
            return reject(err);
          }
          return resolve(data);
        });
      });
    }
  
    async function main() {
      try {
        const params = readParams();
        const data = await getTweets(params.since_id);
        const tweets = data.statuses;
        console.log("We got the tweets", tweets.length);
        for await (let tweet of tweets) {
          try {
            // Tweet text & id
            console.log("el tuit: " + tweet.text);
            var text = tweet.text;
            var id = tweet.id_str;
            console.log("el id:" + id);
  
  
            if (pairing.some(v => text.includes(v))) {
              let found = pairing.find(ship => text.includes(ship))
              console.log("el ship mencionado es " + found);
              //we check the query and reply accordingly
              var userHandle = tweet.user.screen_name;
              var textToReply = TWEETS_TO_REPLY[found][Math.floor(Math.random() * TWEETS_TO_REPLY[found].length)];
              //var textToReply = TWEETS_TO_REPLY.found
              textToReply = "gotcha @" + userHandle + " 🤙 here's a great " + found + " for you: " + textToReply;
              twit.post('statuses/update', { status: textToReply, in_reply_to_status_id: id }, function (err, response) {
                if (err) {
                  console.log("> Error: Status could not be updated. " + err);
                } else {
                  console.log("Replied!!!!!!!");
                }
              });
  
            } else {
              //if the query is wrong, we reply with a random fic from my bookmarks
              var userHandle = tweet.user.screen_name;
              var textToReply = badQuery[Math.floor(Math.random() * badQuery.length)];
              textToReply = "sorry @" + userHandle + ", we couldn't get your order right 😵‍💫 but not to worry! here's one personal favourite for you to enjoy!: " + textToReply;
              twit.post('statuses/update', { status: textToReply, in_reply_to_status_id: id }, function (err, response) {
                if (err) {
                  console.log("> Error: Status could not be updated. " + err);
                } else {
                  console.log("Replied!!!!!!!");
                }
              });
            }
  
  
            // User id and handle
            var userHandle = tweet.user.screen_name;
            console.log("el handle:" + userHandle);
  
  
        
          } catch (e) {
            console.log("Unsuccessful reply " + tweet.id_str);
          }
          params.since_id = tweet.id_str;
        }
        writeParams(params);
      } catch (e) {
        console.error(e);
      }
    }
  //}).listen(process.env.PORT);
  
  
  
  console.log("Starting the twitter bot ...");