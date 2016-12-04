/*
  Sign in Controller
  Logs in user

  Created by bburch
*/
(function() {
    'use strict';

    angular
        .module('signinModule')
        .controller('SigninController', SigninController);

    SigninController.$inject = ['$scope', '$window', '$http', '$state', 'Flash'];

    function SigninController($scope, $window, $http, $state, Flash) {
        $scope.userData = {};
        Flash.clear();

        //Logs user in
        $scope.loginUser = function() {
            $http.post('api/v1/login', $scope.userData)
                .success((data) => {
                    $scope.userData = data.data;
                    window.localStorage.setItem('userData', angular.toJson(data)); //Stores current user in localstorage. Don't do this.
                    $state.go('home'); //Redirects user to home after successful login
                })
                .error((error) => {
                    Flash.clear();
                    Flash.create('danger', 'Wrong username and password combination.', 0, {}, true);
                    console.log(error);
                });
        };
    }
}());
