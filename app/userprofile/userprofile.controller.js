(function() {
    'use strict';

    angular
        .module('userprofileModule')
        .controller('UserprofileController', UserprofileController);

    UserprofileController.$inject = ['$http', '$scope', '$location', '$window', 'Auth', 'FitbitFactory'];

    function UserprofileController($http, $scope, $location, $window, Auth, FitbitFactory) {
        $scope.newuserData = Auth.getUserData();

        $scope.userData = function() {
            return Auth.getUserData();
        }

        $scope.getUserDataProfile = function() {
            $http.get('/api/v1/users/:person_id')
                .success((data) => {
                    console.log(data.data);
                })
                .error((error) => {
                    console.log(error);
                })
        }

        FitbitFactory.isLoggedIn()
            .then(
                function(data) {
                    console.log(data.data.status);
                    $scope.fitbitStatus = data.data.status;
                },
                function(errorData) {
                    console.log(errorData);
                });
    }
}());
