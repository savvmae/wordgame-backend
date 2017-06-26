const express = require('express');
const router = express.Router();


router.get('/winners', (request, response) => {
    if (request.session.finished) {
        response.render('winners')
    } else {
        response.redirect('/');
    }
});

module.exports = router;