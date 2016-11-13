(function() {
    'use strict';

    angular.module('homeModule').config(configFunction);

    configFunction.$inject = ['$stateProvider'];

    function configFunction($stateProvider) {
        $stateProvider.state('home', {
            url: '/home',
            templateUrl: 'home/home.html',
        });
    }
}());
