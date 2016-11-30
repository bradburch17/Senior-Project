(function() {
    'use strict';

    angular
        .module('teamModule')
        .controller('AllTeamController', AllTeamController);

    AllTeamController.$inject = ['$scope', '$http', 'Auth', 'Flash'];

    function AllTeamController($scope, $http, Auth, Flash) {

    }
}());
