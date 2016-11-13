(function() {
    'use strict';

    angular
        .module('teamModule')
        .controller('TeamController', TeamController);

    TeamController.$inject = ['$scope', '$http'];

    function TeamController($scope, $http) {
        $scope.teamData = {};

        $http.get('/api/v1/team')
            .success((data) => {
                $scope.teamData = data.data;
                console.log(data);
                console.log(data.data);
            })
            .error((error) => {
                console.log('Error: ' + error);
            });
    }
}());
