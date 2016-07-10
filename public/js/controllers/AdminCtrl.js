angular.module('AdminCtrl', ['ngResource', 'ngRoute']).controller('AdminController', function($scope, $http){
    $scope.users = [];
    
    $http.get('/users').success(function(users){
        for(var i in users)
            $scope.users.push(users[i]);
    });
});