(function() {
    'use strict';

    angular
        .module('teamModule')
        .controller('AllTeamController', AllTeamController);

    AllTeamController.$inject = ['$scope', '$http', 'Auth', 'Flash'];

    function AllTeamController($scope, $http, Auth, Flash) {
        $scope.teams = {};
        $scope.userData = Auth.getUserData();
        getTeams();

        function getTeams() {
            $http.get('/api/v1/teams')
                .success((data) => {
                    $scope.teams = data.data;
                    console.log(data.data);
                })
                .error((error) => {
                    console.log(error);
                });
        }

        $scope.joinTeam = function(team) {
            $http.post('/api/v1/team/join/' + team.team_id, $scope.userData)
                .success((data) => {
                    console.log(data);
                    Flash.clear();
                    Flash.create('success', 'You have successfully joined the team.', 5000, {}, true);
                })
                .error((error) => {
                    Flash.clear();
                    Flash.create('danger', 'You cannot join this team.', 5000, {}, true);
                    console.log(error);
                });
        }
    }
}());
