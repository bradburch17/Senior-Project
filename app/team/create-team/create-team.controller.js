(function() {
    'use strict';

    angular
        .module('teamModule')
        .controller('CreateTeamController', CreateTeamController);

    CreateTeamController.$inject = ['$scope', '$http', 'Auth', 'Flash'];

    function CreateTeamController($scope, $http, Auth, Flash) {
        var data = {};
        $scope.userData = Auth.getUserData();

        $scope.createTeam = function() {
            data = {
                'teamData': $scope.teamData,
                'userData': $scope.userData
            };
            $http.post('api/v1/team', data)
                .success((data) => {
                    $scope.teamData = data.data;
                    Flash.clear();
                    Flash.create('success', '<strong>Success</strong> You have created a team!', 5000, {}, true);
                    console.log("Inserted");
                })
                .error((error) => {
                    Flash.clear();
                    Flash.create('warning', 'Please enter all required information.', 5000, {}, true);
                    console.log('Error: ' + error);
                });
        };
    }
}());
