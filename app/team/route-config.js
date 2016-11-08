(function() {
    'use strict';

    angular
        .module('teamModule')
        .config(configFunction);

    configFunction.$inject = ['$stateProvider'];

    function configFunction($stateProvider) {
        $stateProvider
            .state('team', {
                url: '/team',
                templateUrl: '/team/team.html',
                controller: 'TeamController',
                // access: {
                //     restricted: true
                // }
            })
    }
}());
