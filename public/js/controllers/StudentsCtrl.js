angular.module('StudentsCtrl', ['ngResource', 'ngRoute']).controller('StudentsController', function(students, $scope){
    var length = students.data.length;
    if(length === 0)
        $scope.message = 'There are no students';
    else {
        $scope.students = students.data;
        $scope.message = '';
    }
});