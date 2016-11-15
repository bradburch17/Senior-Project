(function() {
    'use strict';

    angular
        .module('signinModule')
        .controller('SigninController', SigninController);

    SigninController.$inject = ['$scope', '$rootScope', '$window', '$http', '$state'];

    function SigninController($scope, $rootScope, $window, $http, $state) {
        $scope.userData = {};

        $scope.loginUser = function() {
            $http.post('api/v1/login', $scope.userData)
                .success((data) => {
                    $scope.userData = data.data;
                    console.log('Successful login');
                    console.log(data);
                    $rootScope.loggedIn = true;
                    $rootScope.userData = data;
                    $state.go('home');
                })
                .error((error) => {
                    console.log('Error: ' + error);
                });
        };
    }
}());
