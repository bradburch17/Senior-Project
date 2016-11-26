(function() {
    'use strict';

    angular
        .module('layoutModule')
        .controller('NavController', NavbarController);

    NavbarController.$inject = ['$scope', '$http', 'Auth'];

    function NavbarController($scope, $http, Auth) {
        $scope.loggedIn = function() {
            return Auth.isLoggedIn();
        }

        $scope.userData = function() {
            return Auth.getUserData();
        }

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
        // var userDatas = $scope.userData();
        // var id = userDatas.person_id;
        // console.log(id);
        // $http.get('/api/v1/user/' + id + '/teams')
        //     .success((data) => {
        //         $scope.teamDropdownData = data.data;
        //         console.log(data);
        //         console.log(data.data);
        //     })
        //     .error((error) => {
        //         console.log(error);
        //     });

        // $scope.placehoder = $scope.retrieveData();

    }
}());
