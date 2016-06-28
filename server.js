var express = require('express');
var app = express();
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var serveStatic = require('serve-static');

var port = process.env.PORT || 8080;
var students = require('./routes/students');
var User = require('./models/user');

// Configure Passport
var passport = require('passport');
var expressSession = require('express-session');

app.use(expressSession({
    secret: 'mySecretKey',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done){
    done(null, user._id);
});

passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        done(err, user);
    });
});

var configDB = require('./config/database');
mongoose.connect(configDB.url);

mongoose.connection.on('open', function(){
    console.log('Connected to MongoDB');
});

mongoose.connection.on('error', function(){
    console.err.bind(console, 'MongoDB Error');
});

app.use('/js/jquery.min.js', express.static(__dirname + '/bower_components/jquery/dist/jquery.min.js'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use('/api', students);
app.use(serveStatic(__dirname, {'index': ['public/views/index.html']}))

app.listen(port, function(){
    console.log('localhost:' + port);
});