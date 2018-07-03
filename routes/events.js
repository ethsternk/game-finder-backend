const express = require('express');
const router = express.Router();

// bring in models
let Event = require('../models/event');
let User = require('../models/user');

// add route
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('add_event', {
        title: 'add event'
    });
});

// add submit POST route
router.post('/add', (req, res) => {

    req.checkBody('title', 'Title is required').notEmpty();
    // req.checkBody('author', 'Author is required').notEmpty();
    req.checkBody('lat', 'A latitude value is required').notEmpty();
    req.checkBody('lng', 'A longitude value is required').notEmpty();
    req.checkBody('game', 'Game is required').notEmpty();
    req.checkBody('day', 'Day is required').notEmpty();
    req.checkBody('time', 'Time is required').notEmpty();
    req.checkBody('link', 'Link is required').notEmpty();

    let errors = req.validationErrors();
    if (errors) {
        res.render('add_event', {
            title: 'Add Event',
            errors: errors
        });
    } else {
        let event = new Event();
        event.title = req.body.title;
        event.author = req.user._id;
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
                req.flash('success', 'Event Added');
                res.redirect('/');
            }
        });
    }

});

// load edit form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Event.findById(req.params.id, (err, event) => {
        if (event.author != req.user._id) {
            req.flash('danger', 'Not Authorized');
            return res.redirect('/');
        } else {
            res.render('edit_event', {
                title: 'Edit Event',
                event: event
            });
        }
    });
});

// update submit POST route
router.post('/edit/:id', (req, res) => {
    let event = {};
    event.title = req.body.title;
    // event.author = req.body.author;
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
            req.flash('success', 'Event Updated');
            res.redirect('/');
        }
    });
});

// delete event
router.delete('/:id', function (req, res) {
    if (!req.user._id) {
        res.status(500).send();
    }

    let query = { _id: req.params.id }

    Event.findById(req.params.id, function (err, event) {
        if (event.author != req.user._id) {
            res.status(500).send();
        } else {
            Event.remove(query, (err) => {
                if (err) {
                    console.log(err);
                }
                res.send('Success');
            });
        }
    });

});

// get single event
router.get('/:id', (req, res) => {
    Event.findById(req.params.id, (err, event) => {
        User.findById(event.author, function (err, user) {
            res.render('event', {
                event: event,
                author: user.name
            });
        });
    });
});

// access control
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('danger', 'Please log in');
        res.redirect('/users/login');
    }
}

module.exports = router;