//need to:
// render length of correct word to game page
// fill in correct guess with guess
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
    request.session.guessCount = 0;
    request.session.correctGuesses = [];
    request.session.incorrectGuesses = [];
    request.session.allGuesses = [];
    var newGame = request.session;
    response.render('game', newGame);

});

application.post('/game', (request, response) => {
    request.session.error = "";
    request.session.currentGuess = request.body.guess;
    
    if (request.session.currentGuess.length > 1 || request.session.currentGuess.length === 0 ){
        request.session.error = "Invalid guess";
        response.render('game', request.session);
    } else if (request.session.allGuesses.indexOf(request.session.currentGuess) != -1){
        request.session.error = "You've already guessed that letter";
        response.render('game', request.session);
    } else {
        request.session.allGuesses.push(request.session.currentGuess);

        response.render('game', request.session);
    }
    
});



// application.use((request, response, next) => {
//     var token = "";
//     if(request.cookies){
//         token = request.cookies['token'];
//     }
//     var user = {};
//     if(token){
//         user.isAuthenticated = true;
//         user.name = "bob";
// } else {
//     user.isAuthenticated = false;
// }
//     response.locals.user = user;
//     next();
// });



// application.get('/', (request, response) => {
//     if(response.locals.user.isAuthenticated){
//         response.send('Is authenticated, hello - '+ response.locals.user.name);
//     } else {
//         response.send("is not authenticated");
//     }
   
// })

application.listen(3000);