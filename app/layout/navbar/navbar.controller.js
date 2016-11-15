(function() {
    'use strict';

    angular
        .module('layoutModule')
        .controller('NavController', NavbarController);

    NavbarController.$inject = ['$scope', '$window', 'Auth'];

    function NavbarController($scope, $window, Auth) {
        $scope.loggedIn = Auth.getAuthStatus();
    }
}());
