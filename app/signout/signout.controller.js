/*
  Sign out Controller

  Created by bburch
*/
(function() {
    'use strict';

    angular
        .module('signoutModule')
        .controller('SignoutController', SignoutController);

    SignoutController.$inject = ['$scope', '$window', '$http', '$state'];

    //Logs a user out
    function SignoutController($scope, $window, $http, $state) {
        $scope.logout = function() {
            $http.get('api/v1/logout')
                .success((data) => {
                    $scope.userData = data.data;
                    window.localStorage.clear(); //Clears localstorage. Don't use localstorage.
                    $state.go('home');
                })
                .error((error) => {
                    console.log('Error: ' + error);
                });
        }
    }
}());
