(function() {
    'use strict';

    angular
        .module('personalrecordModule')
        .config(configFunction);

    configFunction.$inject = ['$stateProvider'];

    function configFunction($stateProvider) {
        $stateProvider
            .state('personalrecord', {
                url: '/personalrecords',
                templateUrl: '/personalrecord/personalrecord.html',
                controller: 'PersonalrecordController',
                requireAuth: true,
            })
    }
}());
