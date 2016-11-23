(function() {
    'use strict';

    angular
        .module('signupModule')
        .controller('SignupController', SignupController);

    SignupController.$inject = ['$scope', '$http', '$state', 'Flash'];

    function SignupController($scope, $http, $state, Flash) {
        $scope.userData = {};
        Flash.clear();

        $scope.createUser = function() {
            $http.post('/api/v1/register', $scope.userData)
                .success((data) => {
                    $scope.userData = data.data;
                    console.log("Inserted");
                    Flash.clear();
                    Flash.create('success', '<strong>Success</strong> Your account was created successfully. Please login.', 0, {}, false);
                })
                .error((error) => {
                  Flash.clear();
                  if (error == 'Bad Request') {
                    Flash.create('warning', 'Please fill out all information.', 0, {}, false);
                  }
                  if (error == 'Unauthorized') {
                    Flash.create('warning', 'The username already exists. Please choose another username.', 0, {}, false);
                  }
                    console.log('Error: ' + error);
                });
        };
    }
}());
