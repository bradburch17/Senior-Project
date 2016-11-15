(function() {
    'use strict';

    angular
        .module('signoutModule')
        .controller('SignoutController', SignoutController);

    SigninController.$inject = ['$scope', '$window', '$http', '$state'];

    function SignoutController($scope, $window, $http, $state) {

        $scope.userData = {};

        $scope.logoutUser = function() {
            $http.get('api/v1/logout')
                .success((data) => {
                    $scope.userData = data.data;
                    console.log('Successful logout');
                    console.log(data);
                    $window.localStorage.setItem('loggedIn', false);
                    $window.localStorage.setItem('userData', {}});///////
                    $state.go('home');
                })
                .error((error) => {
                    console.log('Error: ' + error);
                });
        };
    }
}());
