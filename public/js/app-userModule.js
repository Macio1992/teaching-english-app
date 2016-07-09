/* jshint devel: true*/
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
            /*.when('/', {
                templateUrl: '/views/main.html'
            })*/
            .when('/admin', {
                templateUrl: '/views/admin.html',
                controller: 'AdminCtrl',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .when('/', {
                templateUrl: '/views/login.html',
                controller: 'LoginCtrl'
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
                controller: 'EditStudentController'
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

app.service('Students', function($http){
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

app.service('Users', function($http){
    this.createUser = function(user){
        return $http.post('/register', user).then(function(response){
            return response;
        }, function(response){
            console.log(response);
        });
    };
});

app.controller('LoginCtrl', function($scope, $rootScope, $http, $location, Users) {
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

app.controller('AdminCtrl', function($scope, $http){
    $scope.users = [];
    
    $http.get('/users').success(function(users){
        for(var i in users)
            $scope.users.push(users[i]);
    });
});

app.controller('StudentsController', function(students, $scope){
    var length = students.data.length;
    if(length === 0)
        $scope.message = 'There are no students';
    else {
        $scope.students = students.data;
        $scope.message = '';
    }
        
});

app.controller('NewStudentController', function($scope, $location, Students){
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

app.controller('EditStudentController', function($scope, $location, $routeParams, Students) {
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