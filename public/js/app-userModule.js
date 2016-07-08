var app = angular.module('userModule', ['ngResource', 'ngRoute'])
    .config(function($routeProvider, $locationProvider, $httpProvider){
        var checkLoggedin = function($q, $timeout, $http, $location, $rootScope) {
            var deferred = $q.defer();
            
            $http.get('/loggedin').success(function(user){
                if(user !== '0')
                    deferred.resolve();
                else {
                    $rootScope.message = 'You need to log in';
                    deferred.reject();
                    $location.url('/login');
                }
            });
            return deferred.promise;
        };
        
        $httpProvider.interceptors.push(function($q, $location) {
            return {
                response: function(response) {
                    return response;
                },
                responseError: function(response) {
                    if(response.status === 401)
                        $location.url('/login');
                    return $q.reject(response);
                }
            };
        });
        $routeProvider
            .when('/', {
                templateUrl: '/views/main.html'
            })
            .when('/admin', {
                templateUrl: '/views/admin.html',
                controller: 'AdminCtrl',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .when('/login', {
                templateUrl: '/views/login.html',
                controller: 'LoginCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    })
    .run(function($rootScope, $http){
        $rootScope.message  = '';
        $rootScope.logout = function() {
            $rootScope.message = 'Logged out';
            $http.post('/logout');
        };
    });
app.controller('LoginCtrl', function($scope, $rootScope, $http, $location) {
    $scope.user = {};
    
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
});

app.controller('AdminCtrl', function($scope, $http){
    $scope.users = [];
    
    $http.get('/users').success(function(users){
        for(var i in users)
            $scope.users.push(users[i]);
    });
});