angular.module('appRoutes', ['ngResource', 'ngRoute'])
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
            /*.when('/', {
                templateUrl: '/views/main.html'
            })*/
            .when('/admin', {
                templateUrl: '/views/admin.html',
                controller: 'AdminController',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .when('/', {
                templateUrl: '/views/login.html',
                controller: 'LoginController'
            })
            .when('/students', {
                templateUrl: '/views/students.html',
                controller: 'StudentsController',
                resolve: {
                    //loggedin: checkLoggedin,
                    students: function(Students){
                        return Students.getStudents();
                    }
                }
            })
            .when('/new/student', {
                controller: 'NewStudentController',
                templateUrl: '/views/student-form.html'
            })
            .when('/student/:studentId', {
                templateUrl: '/views/student.html',
                controller: 'EditController'
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