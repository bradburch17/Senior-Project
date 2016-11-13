(function() {
    'use strict';

    angular
        .module('aboutModule')
        .config(configFunction);

    configFunction.$inject = ['$stateProvider'];

    function configFunction($stateProvider) {
        $stateProvider
            .state('about', {
                url: '/about',
                templateUrl: 'about/about.html',
            });
    }
}());
