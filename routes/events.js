const express = require('express');
const router = express.Router();

// bring in event model
let Event = require('../models/event');

// add route
router.get('/add', (req, res) => {
    res.render('add_event', {
        title: 'add event'
    });
});

// add submit POST route
router.post('/add', (req, res) => {

    req.checkBody('title', 'Title is required').notEmpty();
    req.checkBody('author', 'Author is required').notEmpty();
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
                req.flash('success', 'Event Added');
                res.redirect('/');
            }
        });
    }

});

// load edit form
router.get('/edit/:id', (req, res) => {
    Event.findById(req.params.id, (err, event) => {
        res.render('edit_event', {
            title: 'Edit Event',
            event: event
        });
    });
});

// update submit POST route
router.post('/edit/:id', (req, res) => {
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
            req.flash('success', 'Article Updated');
            res.redirect('/');
        }
    });
});

router.delete('/:id', (req, res) => {
    let query = { _id: req.params.id }

    Event.remove(query, (err) => {
        if (err) {
            console.log(err);
        }
        res.send('Success');
    });
});

// get single event
router.get('/:id', (req, res) => {
    Event.findById(req.params.id, (err, event) => {
        res.render('event', {
            event: event
        });
    });
});

module.exports = router;