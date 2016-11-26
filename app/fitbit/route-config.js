(function() {
  'use strict';

    angular
    .module('fitbitModule')
    .config(configFunction);

    configFunction.$inject = ['$stateProvider'];

    function configFunction($stateProvider) {
        $stateProvider
            .state('fitbitLogin', {
                url: '/api/v1/fitbit',
                requireAuth: true,
            })
    }
}());
