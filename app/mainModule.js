(function() {
    'use strict';

    angular.module('mainModule', [
            'ui.router',
            'ngFlash',
            'ngMask',

            'homeModule',
            'layoutModule',
            'aboutModule',
            'shoeModule',
            'logrunModule',
            'forgotpassModule',
            'personalrecordModule',
            'signinModule',
            'signupModule',
            'signoutModule',
            'teamModule',
            'userprofileModule',
            'authModule',
            'fitbitModule'
        ])
        .config(configFunction)
        .run(['$rootScope', '$state', 'Auth', function($rootScope, $state, Auth) {
            $rootScope.$on('$stateChangeStart', function(event, next) {
                if (next.requireAuth && !Auth.isLoggedIn()) {
                    event.preventDefault();
                    $state.go('login');
                } else if (Auth.isLoggedIn() || !Auth.isLoggedIn()) {
                    console.log('ALLOW');
                }
            });
        }]);

    configFunction.$inject = ['$urlRouterProvider'];

    function configFunction($urlRouterProvider) {
        $urlRouterProvider.otherwise('/home');
    }

}());
