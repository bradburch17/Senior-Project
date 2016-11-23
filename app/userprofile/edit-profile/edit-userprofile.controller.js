(function() {
    'use strict';

    angular
        .module('userprofileModule')
        .controller('EditProfileController', EditProfileController);

    EditProfileController.$inject = ['$http', '$scope', '$location', '$window', 'Auth', 'Flash'];

    function EditProfileController($http, $scope, $location, $window, Auth, Flash) {
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

        $scope.editProfile = function() {
            $http.put('/api/v1/users/' + $scope.newuserData.person_id, $scope.newuserData)
                .success((data) => {
                    console.log(data.data);
                    window.localStorage.setItem('userData', angular.toJson(data.data));
                    Flash.clear();
                    Flash.create('success', 'You have successfully updated your profile.', 0, {}, true);
                })
                .error((error) => {
                    Flash.clear();
                    Flash.create('warning', 'Please enter all required information.', 0, {}, true);
                    console.log(error);
                });
        }
    }
}());
