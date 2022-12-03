//dependencies
const twit = require("./twit");
const fs = require("fs");
const path = require("path");
const paramsPath = path.join(__dirname, "params.json");
const TWEETS_TO_REPLY = require('./fics');
const badQuery = require('./badquery-fics');
var cont = 0;


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

//setInterval(main, 180000); //3 minutos por el límite de llamadas este
setInterval(main, 3000); //3 segundos para pruebas

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
            q: "@skzficbot",
            count: 10
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
                    let replyTemplates = [];
                    replyTemplates[0] = "gotcha @" + userHandle + " 🤙 here's a great " + found + " for you: ";
                    replyTemplates[1] = "hey, @" + userHandle + "! hope you enjoy this " + found + ": ";
                    replyTemplates[2] = "aye-aye cap'n, i've got exactly what you need: ";
                    replyTemplates[3] = "hope you're hungry, @" + userHandle + ", because here's some food: ";
                    var textToReply = TWEETS_TO_REPLY[found][Math.floor(Math.random() * TWEETS_TO_REPLY[found].length)];
                    let replyText = replyTemplates [Math.floor(Math.random() * replyTemplates.length)];
                    textToReply = replyText + textToReply + " #" + cont;
                    cont++;
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
                    textToReply = "sorry @" + userHandle + ", we couldn't get your order right 😵‍💫 but not to worry! here's one personal favourite for you to enjoy!: " + textToReply + " #" + cont;
                    cont++;
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




console.log("Starting the twitter bot ...");