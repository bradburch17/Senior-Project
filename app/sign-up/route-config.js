(function() {
    'use strict';
    angular.module('signupModule')
        .config(configFunction);

    configFunction.$inject = ['$stateProvider'];

    function configFunction($stateProvider) {
        $stateProvider
            .state('register', {
                url: '/register',
                templateUrl: '/sign-up/signup.html',
                controller: 'SignupController'
            })
    }
}());
