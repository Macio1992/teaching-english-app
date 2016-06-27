angular.module('studentsApp', ['ngRoute'])
    .config(function($routeProvider){
        $routeProvider
            .when('/', {
                templateUrl: '/public/students.html',
                controller: 'StudentsController',
                resolve: {
                    students: function(Students){
                        return Students.getStudents();
                    }
                }
            })
            .when('/new/student', {
                controller: 'NewStudentController',
                templateUrl: '/public/student-form.html'
            })
            .when('/student/:studentId', {
                controller: 'EditStudentController',
                templateUrl: '/public/student.html'
            })
            .otherwise({
                redirectTo: '/'
            })
    })
    .service('Students', function($http){
        this.getStudents = function() {
            return $http.get('/api/students').then(function(response){
                return response;
            }, function(response){
                console.log('Error finding students');
            });
        }
        this.createStudent = function(student){
            return $http.post('api/students', student).then(function(response){
                return response;
            }, function(response){
                console.log('Error creating student')
            });
        }
        this.getStudent = function(studentId){
            var url = 'api/students/' + studentId;
            return $http.get(url).then(function(response){
                return response;
            }, function(response){
                console.log('Error finding this student');
            });
        }
        this.editStudent = function(student){
            var url = 'api/students/' + student._id;
            return $http.put(url, student).then(function(response){
                return response;
            }, function(response){
                console.log('Error editing this student');
            });
        }
        this.deleteStudent = function(studentId) {
            var url = 'api/students/' + studentId;
            return $http.delete(url).then(function(response){
                return response;
            }, function(response){
                console.log('Error deleting this student');
            });
        }
    })
    .controller('StudentsController', function(students, $scope){
        $scope.students = students.data;
    })
    .controller('NewStudentController', function($scope, $location, Students){
        $scope.back = function(){
            $location.path('#/');
        }

        $scope.saveStudent = function(student){
            Students.createStudent(student).then(function(doc){
                var studentUrl = '/student/' + doc.data._id;
                $location.path(studentUrl);
            }, function(response){
                alert(response);
            });
        }
    })
    .controller('EditStudentController', function($scope, $routeParams, Students) {
        Students.getStudent($routeParams.studentId).then(function(doc){
            $scope.student = doc.data;
        }, function(response){
            alert(response);
        });

        $scope.toggleEdit = function() {
            $scope.editMode = true;
            $scope.studentFormUrl = "/public/student-form.html";
        }

        $scope.back = function() {
            $scope.editMode = false;
            $scope.studentFormUrl = "";
        }

        $scope.saveStudent = function(student){
            Students.editStudent(student);
            $scope.editMode = false;
            $scope.studentFormUrl = "";
        }

        $scope.deleteStudent = function(studentId) {
            Students.deleteStudent(studentId);
        }
    });