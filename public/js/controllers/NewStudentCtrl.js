angular.module('NewStudentCtrl', ['ngResource', 'ngRoute']).controller('NewStudentController', function($scope, $location, Students){
    $scope.back = function() {
        $location.url('/students');
    };
    
    $scope.saveStudent = function(student) {
        Students.createStudent(student).then(function(doc){
            var studentUrl = '/student/' + doc.data._id;
            //$location.url('/students');
            $location.url(studentUrl);
        }, function(response) {
            console.log(response);
        });
    };
});