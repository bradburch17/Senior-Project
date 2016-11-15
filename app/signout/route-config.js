(function() {
    'use strict';

    angular
        .module('signoutModule')
        .config(configFunction);

    configFunction.$inject = ['$stateProvider'];

    function configFunction($stateProvider) {
        $stateProvider
            .state('logout', {
                url: '/logout',
                //templateUrl: '/sign-in/signin.html',
                controller: 'SignoutController'
            })
    }
}());
