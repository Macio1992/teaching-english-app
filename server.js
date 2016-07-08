/* jshint node: true */
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var path = require('path');
var passport = require('passport');
//var serveStatic = require('serve-static');

var port = process.env.PORT || 8080;
var students = require('./routes/students');
var users = require('./routes/users');

var configDB = require('./config/database');
mongoose.connect(configDB.url);

mongoose.connection.on('open', function(){
    console.log('Connected to MongoDB');
});

mongoose.connection.on('error', function(){
    console.err.bind(console, 'MongoDB Error');
});

app.set('view engine', 'ejs');
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(expressSession({
    secret: 'securredSession',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'bower_components')));
app.use(express.static(path.join(__dirname, 'public')));

//app.use(serveStatic(__dirname, {'index': ['public/views/index.html']}));

app.use('/api', students);
app.use('/', users);

app.listen(port, function(){
    console.log('localhost:' + port);
});