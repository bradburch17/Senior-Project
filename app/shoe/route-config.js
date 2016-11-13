(function() {
    'use strict';

    angular
        .module('shoeModule')
        .config(configFunction);

    configFunction.$inject = ['$stateProvider'];

    function configFunction($stateProvider) {

        $stateProvider
            .state('shoe', {
                url: '/shoe',
                templateUrl: '/shoe/shoe.html',
                controller: 'ShoeController',
            })
    }
}());
