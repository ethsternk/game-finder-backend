const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database');
const cors = require('cors');

mongoose.connect(config.database);
let db = mongoose.connection;

// check connection
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// check for db errors
db.on('error', (err) => {
    console.log(err);
});

// init app
const app = express();

// bring in models
let Event = require('./models/event');

// load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// cors stuff
app.use(cors());

// set public folder
app.use(express.static(path.join(__dirname, 'public')));

// express session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));

// express messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

// express validator middleware
app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.')
            , root = namespace.shift()
            , formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        }
    }
}));

// passport config
require('./config/passport')(passport);
// passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function (req, res, next) {
    res.locals.user = req.user || null;
    next();
});

// cors stuff
app.get('/products/:id', function (req, res, next) {
    res.json({ msg: 'This is CORS-enabled for all origins!' })
})

// home route
app.get('/', (req, res) => {
    Event.find({}, (err, events) => {
        if (err) {
            console.log(err);
        } else {
            res.render('index', {
                title: 'Events',
                events: events
            });
        }
    });
});

// events route raw
app.get('/events', (req, res) => {
    Event.find({}, (err, events) => {
        if (err) {
            console.log(err);
        } else {
            res.send(events);
        }
    });
});

// route files
let events = require('./routes/events');
let users = require('./routes/users');
app.use('/events', events)
app.use('/users', users)

// start server
app.listen(80, () => {
    console.log('Server started on port 80');
});