(function() {
    'use strict';

    angular
        .module('teamModule')
        .controller('AllTeamController', AllTeamController);

    AllTeamController.$inject = ['$scope', '$http', 'Auth', 'Flash'];

    function AllTeamController($scope, $http, Auth, Flash) {
        $scope.teams();

        $scope.teams = function() {
            $http.get('/api/v1/teams')
                .success((data) => {
                    $scope.teams = data.data;
                    console.log(data.data);
                })
                .error((error) => {
                    console.log(error);
                })
        }
    }
}());
