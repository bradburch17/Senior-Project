(function() {
    'use strict';

    angular
        .module('signinModule')
        .controller('SigninController', SigninController);

    SigninController.$inject = ['$scope', '$window', '$http', '$state', 'Auth'];

    function SigninController($scope, $window, $http, $state, Auth) {
        $scope.userData = {};

        $scope.loginUser = function() {
            $http.post('api/v1/login', $scope.userData)
                .success((data) => {
                    $scope.userData = data.data;
                    console.log('Successful login');
                    console.log(data);
                    window.localStorage.setItem('userData', angular.toJson(data));
                    $state.go('home');
                })
                .error((error) => {
                    console.log('Error: ' + error);
                });
        };
    }
}());
