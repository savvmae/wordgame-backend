//need to:
// win file with images??

const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mustacheExpress = require('mustache-express');
const session = require('express-session');
const morgan = require('morgan');
const fileStream = require('fs');
const fs = require('file-system');
const winners = require('./models/winners.json');
const homeController = require('./routes/home');
const gameController = require('./routes/game');
const winController = require('./routes/win');
const winnersController = require('./routes/winners');
const filePath = './models/winners.json';

const application = express();

application.use(cookieParser());
application.use(bodyParser());
application.use(morgan('common', { stream: fileStream.createWriteStream(`./logs/${new Date()}.log`)}));

application.engine('mustache', mustacheExpress());
application.set('views', './views');
application.set('view engine', 'mustache');

application.use(bodyParser.urlencoded());
application.use(express.static(__dirname + '/public'));
application.use(session({
    secret: 'iAmASecret',
    saveUninitialized: true,
    resave: false
}));
application.use(gameController);
application.use(homeController);
application.use(winController);
application.use(winnersController);

application.listen(3000);