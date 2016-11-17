(function() {
    'use strict';

    angular
        .module('layoutModule')
        .controller('NavController', NavbarController);

    NavbarController.$inject = ['$scope', 'Auth'];

    function NavbarController($scope, Auth) {
        $scope.loggedIn = function(){
          return Auth.isLoggedIn();
        }

        $scope.userData = function() {
          return Auth.getUserData();
        }

    }
}());
