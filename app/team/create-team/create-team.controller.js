/*
  Create Team Controller

  Created by bburch
*/
(function() {
    'use strict';

    angular
        .module('teamModule')
        .controller('CreateTeamController', CreateTeamController);

    CreateTeamController.$inject = ['$scope', '$http', 'Auth', 'Flash'];

    function CreateTeamController($scope, $http, Auth, Flash) {
        $scope.userData = Auth.getUserData();
        var data = {};

        //Creates a team
        $scope.createTeam = function() {
            //JSON object for server
            data = {
                'teamData': $scope.teamData,
                'userData': $scope.userData
            };

            $http.post('api/v1/team', data)
                .success((data) => {
                    $scope.teamData = data.data;
                    Flash.clear();
                    Flash.create('success', '<strong>Success</strong> You have created a team!', 5000, {}, true);
                })
                .error((error) => {
                    console.log(error);
                    Flash.clear();
                    Flash.create('warning', 'Please enter all required information.', 5000, {}, true);
                });
        };
    }
}());
