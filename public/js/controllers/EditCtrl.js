angular.module('EditCtrl', ['ngResource', 'ngRoute']).controller('EditController', function($scope, $location, $routeParams, Students){
    Students.getStudent($routeParams.studentId).then(function(doc){
        $scope.student = doc.data;
    }, function(response) {
        console.log(response);
    });
    
    $scope.toggleEdit = function() {
        $scope.editMode = true;
        $scope.studentFormUrl = '/views/student-form.html';
    };
    
    $scope.back = function() {
        $scope.editMode = false;
        $scope.studentFormUrl = "";
    };
    
    $scope.saveStudent = function(student) {
        Students.editStudent(student);
        $scope.editMode = false;
        $scope.studentFormUrl = '';
    };
    
    $scope.deleteStudent = function(studentId) {
        
        Students.deleteStudent(studentId).then(function(){
            $location.url('/students');
        });
        
    };
});