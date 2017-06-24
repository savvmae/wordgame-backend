//need to:
// hard mode:
// let user pick length of word/difficulty
// win file with images??

const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const mustacheExpress = require('mustache-express');
const session = require('express-session');
const fs = require('file-system');
const winners = require('./winners.json');

const filePath = './winners.json';

const application = express();

application.use(cookieParser());
application.use(bodyParser());

application.engine('mustache', mustacheExpress());

application.set('views', './views');
application.set('view engine', 'mustache');

application.use(bodyParser.urlencoded());
application.use(expressValidator());
application.use(express.static(__dirname + '/public'));

const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");

application.use(session({
    secret: 'iAmASecret',
    saveUninitialized: true,
    resave: false
}));

application.get('/', (request, response) => {
    response.render('index');
});

application.get('/win', (request, response) => {
    response.render('win');
});

application.get('/winners', (request, response) => {
    response.render('winners')
});

application.get('/game', (request, response) => {

    request.session.newWord = words[Math.floor(Math.random() * (words.length - 1))];
    request.session.newWordArr = request.session.newWord.split("");
    request.session.appearingLetters = request.session.newWord.split("");
    request.session.guessCount = 8;
    request.session.correctGuesses = [];
    request.session.incorrectGuesses = [];
    request.session.allGuesses = [];
    request.session.currentGuess = "";
    request.session.dashes = [];
    for (i = 0; i <= (request.session.newWordArr.length - 1); i++) {
        request.session.dashes.push("_");
    }

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
            evaluateGuess(request.session.newWordArr, request.session.currentGuess, request.session.dashes);
            letterAppear(request.session.dashes, request.session.appearingLetters, request.session.currentGuess);

            if (request.session.newWordArr.length === 0) {

                response.redirect('/win');
            } else {
                response.render('game', request.session);
            }
        } else {
            request.session.incorrectGuesses.push(request.session.currentGuess);
            request.session.guessCount--;
            if (request.session.guessCount === 0) {
                response.render('lost', request.session);
            } else {
                response.render('game', request.session);
            }
        }
    }
});

application.post('/win', (request, response) => {
    winners.names.push(request.body.name);
    var winnersJSON = JSON.stringify(winners);
    fs.writeFile(filePath, winnersJSON, function (err) { });
    response.render('winners', winners);
})

function evaluateGuess(arr, guess) {
    for (var i = 0; i < arr.length; i++) {
        if (arr.indexOf(guess) != -1) {
            var index = arr.indexOf(guess);
            arr.splice(index, 1);
        }
    }
    return arr;
}

function letterAppear(arr1, arr2, guess) {
    for (var i = 0; i <= arr1.length; i ++){
        while (arr2.indexOf(guess) != -1) {
            var index = arr2.indexOf(guess);
            arr2.splice(index, 1, "/");
            arr1.splice(index, 1, guess);
        }
    }
    return arr1; 
}

application.listen(3000);