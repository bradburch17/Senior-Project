(function() {
    'use strict';

    angular
        .module('authModule')
        .config(configFunction);

    configFunction.$inject = ['$stateProvider'];

    function configFunction($stateProvider) {
        $stateProvider
            .state('auth', {
                url: '/auth',
                controller: 'AuthController'
            })
    }

}());
