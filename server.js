var express = require('express');
var app = express();
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

var port = process.env.PORT || 8080;

var configDB = require('./config/database');
mongoose.connect(configDB.url);

var students = require('./routes/students');

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

/*app.get('/', function(req, res){
    res.send({message: 'hooray! welcome to our app'});
});*/

// app.get('*', function(req, res){
//     res.sendFile(__dirname + '/public/views/index.html');
// });
var serveStatic = require('serve-static');
app.use(serveStatic(__dirname, {'index': ['public/index.html']}))

app.listen(port, function(){
    console.log('localhost:' + port);
});