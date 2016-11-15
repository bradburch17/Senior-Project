(function() {
    'use strict';

    angular
        .module('authModule')
        .controller('AuthController', AuthController);

    AuthController.$inject = ['$scope', 'Auth'];

    function AuthController($scope, Auth) {
        $scope.loggedIn = Auth.getAuthStatus();
        console.log('Scope: ' + $scope.loggedIn);
        $scope.userData = Auth.getUserData();
    }
}());
