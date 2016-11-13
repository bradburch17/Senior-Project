(function() {
    'use strict';

    angular
        .module('signinModule')
        .config(configFunction);

    configFunction.$inject = ['$stateProvider'];

    function configFunction($stateProvider) {
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: '/sign-in/signin.html',
                controller: 'SigninController'
            })
    }
}());
