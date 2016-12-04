(function() {
    'use strict';

    angular
        .module('teamModule')
        .config(configFunction);

    configFunction.$inject = ['$stateProvider'];

    function configFunction($stateProvider) {
        $stateProvider
            .state('create-team', {
                url: '/team/create',
                templateUrl: '/team/create-team/create-team.html',
                controller: 'CreateTeamController',
                requireAuth: true,
            })

        .state('team', {
            url: '/team/:id',
            templateUrl: '/team/team.html',
            controller: 'TeamController',
            requireAuth: true,
        })

        .state('edit-team', {
            url: '/team/:id/edit',
            templateUrl: 'team/edit-team/edit-team.html',
            controller: 'EditTeamController',
            requireAuth: true,
        })

        .state('all-teams', {
            url: '/teams',
            templateUrl: 'team/all-teams/teams.html',
            controller: 'AllTeamController',
            requireAuth: true,
        })
    }
}());
