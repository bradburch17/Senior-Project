(function() {
    'use strict';

    angular
        .module('signupModule')
        .controller('SignupController', SignupController);

    SignupController.$inject = ['$scope', '$http', '$state'];

    function SignupController($scope, $http, $state) {
        $scope.userData = {};

        $scope.createUser = function() {
            $http.post('/api/v1/register', $scope.userData)
                .success((data) => {
                    $scope.userData = data.data;
                    console.log("Inserted");
                    $state.go('home');
                })
                .error((error) => {
                    console.log('Error: ' + error);
                });
        };
    }
}());
