const express = require('express');
const router = express.Router();
const game = require('../models/game');

router.get('/game', (request, response) => {
    if (!request.session.finished) {
        var game = request.session;
        response.render('game', game);
    } else {
        response.redirect('/');
    }

});

router.post('/game', (request, response) => {
    if (!request.session.finished) {
        request.session.error = "";
        request.session.currentGuess = request.body.guess.toLowerCase();
        if (request.session.currentGuess.length > 1 || request.session.currentGuess.length === 0 || !game.isLetter(request.session.currentGuess)) {
            request.session.error = "Invalid guess";
            response.render('game', request.session);
        } else if (request.session.allGuesses.indexOf(request.session.currentGuess) != -1) {
            request.session.error = "You've already guessed that letter";
            response.render('game', request.session);
        } else {
            request.session.allGuesses.push(request.session.currentGuess);
            if (request.session.newWordArr.indexOf(request.session.currentGuess) != -1) {
                request.session.correctGuesses.push(request.session.currentGuess);
                game.evaluateGuess(request.session.newWordArr, request.session.currentGuess, request.session.dashes);
                game.letterAppear(request.session.dashes, request.session.appearingLetters, request.session.currentGuess);

                if (request.session.newWordArr.length === 0) {
                    request.session.finished = true;
                    response.redirect('/win');
                } else {
                    response.render('game', request.session);
                }
            } else {
                request.session.incorrectGuesses.push(request.session.currentGuess);
                request.session.guessCount--;
                if (request.session.guessCount === 0) {
                    request.session.finished = true;
                    response.render('lost', request.session);
                } else {
                    response.render('game', request.session);
                }
            }
        }
    } else {
        response.redirect('/');
    }
});

module.exports = router;