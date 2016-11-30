(function() {
    'use strict';

    angular
        .module('teamModule')
        .controller('TeamController', TeamController);

    TeamController.$inject = ['$scope', '$http', '$stateParams'];

    function TeamController($scope, $http, $stateParams) {
        $scope.team_id = $stateParams.id;
        console.log('ID: ' + $scope.team_id);
        $scope.teamData = {};

        $http.get('/api/v1/team/' + $scope.team_id)
            .success((data) => {
                $scope.teamData = data.data;
                console.log(data.data);
            })
            .error((error) => {
                console.log(error);
            });
    }
}());
