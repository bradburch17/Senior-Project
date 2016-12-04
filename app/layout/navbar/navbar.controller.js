/*
  Navbar controller
  Checks if user is logged in and retrieves user data

  Created by bburch
*/
(function() {
    'use strict';

    angular
        .module('layoutModule')
        .controller('NavController', NavbarController);

    NavbarController.$inject = ['$scope', '$http', 'Auth'];

    function NavbarController($scope, $http, Auth) {
        //Checks if user is logged in
        $scope.loggedIn = function() {
            return Auth.isLoggedIn();
        }

        //Gets userData from local storage
        $scope.userData = function() {
            return Auth.getUserData();
        }

        //Retrieves userdata, specifically teams, from server for load on Team dropdown 
        $scope.retrieveData = function() {
            var userData = $scope.userData();
            if ($scope.loggedIn) {
                Auth.getAllUserData(userData.person_id)
                    .then(
                        function(data) {
                            $scope.allUserData = data.data.data.teams;
                            console.log($scope.allUserData);
                        },
                        function(errorData) {
                            console.log(errorData);
                        });
            }
        }

    }
}());
