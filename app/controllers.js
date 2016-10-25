//NOT IN USE
var app = angular.module('app.controllers', []);

app.controller('xuserController', function() {
    this.users = testData;
});

app.controller('userController', ($scope, $http) => {
    $scope.formData = {};
    $scope.userData = {};

    $http.get('/api/v1/users')
        .success((data) => {
            $scope.userData = data.data;
            console.log(data.data);
            console.log(data);
        })
        .error((error) => {
            console.log('Error: ' + error);
        });

    $scope.deleteUser = function(person_id) {
        console.log(person_id);
        $http.delete('api/v1/users/' + person_id)
            .success((data) => {
                $scope.userData = data.data;
                console.log("Deleted");
            })
            .error((error) => {
                console.log('Error: ' + error);
            });
    };
});

app.controller('loginController', ($scope, $http, $state) => {
    $scope.userData = {};

    $scope.loginUser = function() {
        $http.post('api/v1/login', $scope.userData)
            .success((data) => {
                $scope.userData = data.data;
                console.log('Successful login.');
                console.log(data);
                $state.go('home');
            })
            .error((error) => {
                console.log('Error: ' + error);
            });
    };
});

app.controller('shoeController', ($scope, $http) => {
    $scope.shoeData = {};

    $scope.createShoe = function() {
        $http.post('api/v1/shoes', $scope.shoeData)
            .success((data) => {
                $scope.shoeData = data.data;
                console.log("Inserted");
            })
            .error((error) => {
                console.log('Error: ' + error);
            });
    };
});

app.controller('prController', ($scope, $http) => {
    $scope.prData = {};

    $scope.createPR = function() {
        $http.post('/api/v1/prs', $scope.prData)
            .success((data) => {
                $scope.prData = data.data;
                console.log("Inserted");
            })
            .error((error) => {
                console.log('Error: ' + error);
            });
    };
});

app.controller('logController', ($scope, $http) => {
    $scope.logData = {};

    $scope.createLog = function() {
        $http.post('/api/v1/logs', $scope.logData)
            .success((data) => {
                $scope.logData = data.data;
                console.log("Inserted");
            })
            .error((error) => {
                console.log('Error: ' + error);
            });
    };
});

app.controller('registerController', function($scope, $http, $location) {
    $scope.userData = {};

    $scope.register = function(user) {
        $http.post('/api/v1/register', $scope.userData)
            .success((data) => {
                $scope.userData = data.data;
                console.log("Inserted");
            })
            .error((error) => {
                console.log('Error: ' + error);
            });
    }
});
