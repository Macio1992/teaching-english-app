/* jshint node: true */
var express = require('express');
var app = express();
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var User = require('../models/user');

passport.use(new localStrategy(
    function(username, password, done) {
        User.findOne({ username: username, password: password}, function(err, user){
            if(err){
                return done(err);
            }
            if(!user) {
                return done(null, false, {message: 'Incorrect username'});
            }
            return done(null, user);
        });
    }
));

passport.serializeUser(function(user, done){
    done(null, user.id);
});

passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        done(err, user);
    });
});

var auth = function(req, res, next) {
    if(!req.isAuthenticated())
        res.sendStatus(401);
    else
        next();
};

app.get('/', function(req, res){
    res.render('index', {
        title: 'Student app'
    });
});

app.get('/users', auth, function(req, res){
    User.find(function(err, users){
        if(err){
            res.send(err);
        } else {
            res.json(users);
        }
    });
});

app.post('/register', function(req, res){
    var user = new User();
    user.username = req.body.username;
    user.password = req.body.password;
    
    user.save(function(err){
        if(err){
            res.send(err);
        } else {
            res.json(user);
        }
    });
});

app.get('/loggedin', function(req, res){
    res.send(req.isAuthenticated() ? req.user : '0');
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/users',
    failureRedirect: '/'
}));

app.post('/logout', function(req, res){
    req.logOut();
    res.sendStatus(200);
});

module.exports = app;