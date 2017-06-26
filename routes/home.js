const express = require('express');
const router = express.Router();
const dictionary = require('../models/dictionary');


router.get('/', (request, response) => {
    if (request.session.newWord === undefined || request.session.finished) {
        response.render('index');
    } else {
        var game = request.session;
        response.render('game', game)
    }
});


router.post('/', (request, response) => {

    if (request.body.mode === '0') {
        request.session.newWord = dictionary.easy[Math.floor(Math.random() * (dictionary.easy.length - 1))];
    } else if (request.body.mode === '1') {
        request.session.newWord = dictionary.normal[Math.floor(Math.random() * (dictionary.normal.length - 1))];
    } else if (request.body.mode === '2') {
        request.session.newWord = dictionary.hard[Math.floor(Math.random() * (dictionary.hard.length - 1))];
    }
    request.session.finished = false;
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

router.post('/reset', (request, response) => {
    request.session.destroy();
    response.redirect('/');
});

module.exports = router;