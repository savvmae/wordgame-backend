//need to:
// render length of correct word to game page
// multiple letters in correct word - doesn't work currently
//
//
// hard mode:
// let user pick length of word/difficulty
// 

const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const mustacheExpress = require('mustache-express');
const session = require('express-session');
const fs = require('file-system');

const application = express();

application.use(cookieParser());
application.use(bodyParser());

application.engine('mustache', mustacheExpress());

application.set('views', './views');
application.set('view engine', 'mustache');

application.use(bodyParser.urlencoded());
application.use(expressValidator());

const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");

application.use(session({
    secret: 'iAmASecret',
    saveUninitialized: true,
    resave: false
}));

application.get('/', (request, response) => {
    response.render('index');
});

application.get('/game', (request, response) => {

    request.session.newWord = words[Math.floor(Math.random() * (words.length - 1))];
    request.session.newWordArr = request.session.newWord.split("");
    request.session.guessCount = 0;
    request.session.correctGuesses = [];
    request.session.incorrectGuesses = [];
    request.session.allGuesses = [];
    request.session.currentGuess = "";
    var newGame = request.session;
    response.render('game', newGame);

});

application.post('/game', (request, response) => {
    request.session.error = "";
    request.session.currentGuess = request.body.guess.toLowerCase();

    if (request.session.currentGuess.length > 1 || request.session.currentGuess.length === 0) {
        request.session.error = "Invalid guess";
        response.render('game', request.session);
    } else if (request.session.allGuesses.indexOf(request.session.currentGuess) != -1) {
        request.session.error = "You've already guessed that letter";
        response.render('game', request.session);
    } else {
        request.session.allGuesses.push(request.session.currentGuess);


        if (request.session.newWordArr.indexOf(request.session.currentGuess) != -1) {
            request.session.correctGuesses.push(request.session.currentGuess);
            // for (i = 0; i < request.session.newWordArr.length; i++) {
            //     var index = request.session.newWordArr.indexOf(request.session.currentGuess);
            //     request.session.newWordArr = request.session.newWordArr.slice(0, index) + request.session.newWordArr.slice(index + 1);
            // }
            // this is broken, fix logic
            response.render('game', request.session);
        } else {
            request.session.incorrectGuesses.push(request.session.currentGuess);
            request.session.guessCount++;
            if (request.session.guessCount >= 8) {
                response.render('lost', request.session);
            } else {
                response.render('game', request.session);
            }
        }
    }
});



application.listen(3000);