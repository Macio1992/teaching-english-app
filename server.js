var express = require('express');
var app = express();
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

var port = process.env.PORT || 8080;

var configDB = require('./config/database');
mongoose.connect(configDB.url);

mongoose.connection.on('open', function(){
    console.log('Connected to MongoDB');
});

mongoose.connection.on('error', function(){
    console.err.bind(console, 'MongoDB Error');
});

/*app.get('/', function(req, res){
    res.send({message: 'hooray! welcome to our app'});
});*/

app.get('*', function(req, res){
    res.sendFile(__dirname + '/views/index.html');
});

app.listen(port, function(){
    console.log('localhost:' + port);
});