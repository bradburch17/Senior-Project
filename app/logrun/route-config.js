(function() {
    'use strict';

    angular
        .module('logrunModule')
        .config(configFunction);

    configFunction.$inject = ['$stateProvider'];

    function configFunction($stateProvider) {
        $stateProvider
            .state('log', {
                url: '/log',
                templateUrl: '/logrun/logrun.html',
                controller: 'LogrunController',
                requireAuth: true,
            });
    }
}());
