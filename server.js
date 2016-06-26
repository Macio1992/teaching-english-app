var express = require('express');
var app = express();

var port = process.env.PORT || 8080;

/*app.get('/', function(req, res){
    res.send({message: 'hooray! welcome to our app'});
});*/

app.get('*', function(req, res){
    res.sendFile(__dirname + '/views/index.html');
});

app.listen(port, function(){
    console.log('localhost:' + port);
});