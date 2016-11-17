(function() {
    'use strict';

    angular
        .module('userprofileModule')
        .controller('UserprofileController', UserprofileController);

    UserprofileController.$inject = ['$http', '$scope', '$window', 'Auth', 'FitbitFactory'];

    function UserprofileController($http, $scope, $window, Auth, FitbitFactory) {
        $scope.newuserData = Auth.getUserData();

        $scope.userData = function() {
            return Auth.getUserData();
        }

        $scope.fitbitLogin = function() {
            return FitbitFactory.fitbitLogin();
        }

        $scope.editProfile = function() {
            $http.put('/api/v1/users/' + $scope.newuserData.person_id, $scope.newuserData)
                .success((data) => {
                  console.log(data.data);
                  window.localStorage.setItem('userData', angular.toJson(data.data));
                })
                .error((error) => {
                    console.log(error);
                });
        }
    }
}());
