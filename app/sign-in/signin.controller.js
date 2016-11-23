(function() {
    'use strict';

    angular
        .module('signinModule')
        .controller('SigninController', SigninController);

    SigninController.$inject = ['$scope', '$window', '$http', '$state', 'Auth', 'Flash'];

    function SigninController($scope, $window, $http, $state, Auth, Flash) {
        $scope.userData = {};
        Flash.clear();

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
                    Flash.clear();
                    Flash.create('danger', 'Wrong username and password combination.', 0, {}, true);
                    console.log('Error: ' + error);
                });
        };
    }
}());
