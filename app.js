const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost/game-finder');
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
let Article = require('./models/article');
let Event = require('./models/event');

// load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// set public folder
app.use(express.static(path.join(__dirname, 'public')));

// express session middleware
// app.use(session({
//     secret: 'keyboard cat',
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: true }
// }));

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

// get single event
app.get('/event/:id', (req, res) => {
    Event.findById(req.params.id, (err, event) => {
        res.render('event', {
            event: event
        });
    });
});

// add route
app.get('/events/add', (req, res) => {
    res.render('add_event', {
        title: 'add event'
    });
});

// add submit POST route
app.post('/events/add', (req, res) => {
    let event = new Event();
    event.title = req.body.title;
    event.author = req.body.author;
    event.lat = req.body.lat;
    event.lng = req.body.lng;
    event.game = req.body.game;
    event.day = req.body.day;
    event.time = req.body.time;
    event.link = req.body.link;

    event.save((err) => {
        if (err) {
            console.log(err);
            return;
        } else {
            res.redirect('/');
        }
    });
});

// load edit form
app.get('/event/edit/:id', (req, res) => {
    Event.findById(req.params.id, (err, event) => {
        res.render('edit_event', {
            title: 'Edit Event',
            event: event
        });
    });
});

// update submit POST route
app.post('/events/edit/:id', (req, res) => {
    let event = {};
    event.title = req.body.title;
    event.author = req.body.author;
    event.lat = req.body.lat;
    event.lng = req.body.lng;
    event.game = req.body.game;
    event.day = req.body.day;
    event.time = req.body.time;
    event.link = req.body.link;

    let query = { _id: req.params.id }

    Event.update(query, event, (err) => {
        if (err) {
            console.log(err);
            return;
        } else {
            res.redirect('/');
        }
    });
});

app.delete('/event/:id', (req, res) => {
    let query = { _id: req.params.id }

    Event.remove(query, (err) => {
        if (err) {
            console.log(err);
        }
        res.send('Success');
    });
});

// start server
app.listen(3000, () => {
    console.log('Server started on port 3000');
});