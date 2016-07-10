angular.module('LoginCtrl', ['ngResource', 'ngRoute']).controller('LoginController', function($scope, $rootScope, $http, $location){
    $scope.user = {};
    $scope.createUser  = {};
    
    $scope.login = function() {
        $http.post('/login', {
            username: $scope.user.username,
            password: $scope.user.password
        })
        .success(function(user){
            $rootScope.message = 'Authentication successful!';
            $location.url('/admin');
        })
        .error(function(){
            $rootScope.message = 'Authentication failed';
            $location.url('/login');
        });
    };
    $scope.register = function() {
        $http.post('/register', {
            username: $scope.createUser.username,
            password: $scope.createUser.password
        })
        .success(function(){
            $location.url('/login');
        })
        .error(function(){
            console.log('error adding user');
        });
    };
});