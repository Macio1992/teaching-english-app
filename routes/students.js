var express = require('express');
var router = express.Router();
var Student = require('../models/student');

router.route('/students')
    .get(function(req, res){
        Student.find(function(err, students){
            if(err) {
                res.send(err);
            } else {
                res.json(students);
            }
        });
    })
    .post(function(req, res){
        Student.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            age: req.body.age
        }, function(err){
            if(err){
                res.send(err);
            }
            Student.find(function(err, students){
                if(err){
                    res.send(err);
                } else {
                    res.json(students);
                }
            });
        });
    });

module.exports = router;