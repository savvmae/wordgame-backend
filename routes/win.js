const express = require('express');
const router = express.Router();
const winners = require('../models/winners.json');
const fs = require('file-system');
const filePath = '../models/winners.json';

router.get('/win', (request, response) => {
    if (request.session.finished) {
        response.render('win');
    } else {
        response.redirect('/');
    }
});


router.post('/win', (request, response) => {
    request.session.nameError = "";
    if (request.session.finished && request.body.name.length >= 1) {
        winners.names.push(request.body.name);
        var winnersJSON = JSON.stringify(winners);
        fs.writeFile(filePath, winnersJSON, function (err) { });
        response.render('winners', winners);
    } else if (request.body.name.length < 1) {
        request.session.nameError = "You must enter a name.";
        response.render('win', request.session);
    } else {
        response.redirect('/');
    }
});

module.exports = router;