/*
  Edit Team Controller -- CURRENTLY NOT IMPLEMENTED

  Created by bburch
*/
(function() {
    'use strict';

    angular
        .module('teamModule')
        .controller('EditTeamController', EditTeamController);

    EditTeamController.$inject = ['$scope', '$http', 'Flash'];

    function EditTeamController($scope, $http, Flash) {
        //Allows user to edit a team
        $scope.editTeam = function() {
            data = {
                'teamData': $scope.teamData,
                'userData': $scope.userData
            };

            $http.put('api/v1/team/' + $scope.teamData.team_id, data) //this won't work because team_id isn't a thing.
                .success((data) => {
                    $scope.teamData = data.data;
                    Flash.clear();
                    Flash.create('success', '<strong>Success</strong> You successfully updated the team!', 5000, {}, true);
                    console.log("Inserted");
                })
                .error((error) => {
                    console.log(error);
                    Flash.clear();
                    Flash.create('warning', 'Please enter all required information.', 5000, {}, true);
                });
        };
    }
}());
