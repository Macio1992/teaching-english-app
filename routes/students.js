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
        var student = new Student();
        student.firstName = req.body.firstName;
        student.lastName = req.body.lastName;
        student.age = req.body.age;

        student.save(function(err){
            if(err){
                res.send(err);
            } else{
                res.json(student);
            }
        })
    });

router.route('/students/:student_id')
    .get(function(req, res){
        Student.findById(req.params.student_id, function(err, student){
            if(err){
                res.send(err);
            } else {
                res.json(student);
            }
        });
    })
    .put(function(req, res){
        Student.findById(req.params.student_id, function(err, student){
            if(err){
                res.send(err);
            } else {
                student.firstName = req.body.firstName;
                student.lastName = req.body.lastName;
                student.age = req.body.age;

                student.save(function(err){
                    res.json(student);
                });
            }
        });
    })
    .delete(function(req, res){
        Student.remove({
            _id: req.params.student_id
        }, function(err, student){
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