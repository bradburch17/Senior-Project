/*
  Edit Profile Controller

  Created by bburch
*/
(function() {
    'use strict';

    angular
        .module('userprofileModule')
        .controller('EditProfileController', EditProfileController);

    EditProfileController.$inject = ['$http', '$scope', '$location', '$window', 'Auth', 'Flash'];

    function EditProfileController($http, $scope, $location, $window, Auth, Flash) {
        $scope.newuserData = Auth.getUserData();

        //Allows user to edit selecte profile information
        $scope.editProfile = function() {
            $http.put('/api/v1/users/' + $scope.newuserData.person_id, $scope.newuserData)
                .success((data) => {
                    window.localStorage.setItem('userData', angular.toJson(data.data)); //Updates localstorage. Do not use this.
                    Flash.clear();
                    Flash.create('success', 'You have successfully updated your profile.', 0, {}, true);
                })
                .error((error) => {
                    console.log(error);
                    Flash.clear();
                    Flash.create('warning', 'Please enter all required information.', 0, {}, true);
                });
        }
    }
}());
