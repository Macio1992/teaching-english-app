angular.module('StudentService', ['ngResource', 'ngRoute']).service('Students', function($http){
    this.getStudents = function() {
        return $http.get('/api/students').then(function(response){
            return response;
        }, function(response){
            console.log('Error finding students');
        });
    };
    this.createStudent = function(student) {
        return $http.post('/api/students', student).then(function(response){
            return response;
        }, function(response) {
            console.log('Error creating student');
        });
    };
    this.getStudent = function(studentId) {
        var url = '/api/students/' + studentId;
        return $http.get(url).then(function(response) {
            return response;
        }, function(response) {
            console.log('Error finding this student');
        });
    };
    this.editStudent = function(student) {
        var url = '/api/students/' + student._id;
        return $http.put(url, student).then(function(response) {
            return response;
        }, function(response) {
            console.log('Error deleting this student');
        });
    };
    this.deleteStudent = function(studentId) {
        var url = '/api/students/' + studentId;
        return $http.delete(url).then(function(response) {
            return response;
        }, function(response) {
            console.log('Error deleting this student');
        });
    };
});