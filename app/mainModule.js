(function() {
    'use strict';

    angular.module('mainModule', [
            'ui.router',

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
        ])
        .config(configFunction)
        .run(['$rootScope', '$state', 'Auth', function($rootScope, $state, Auth) {
            $rootScope.$on('$stateChangeStart', function(event, next) {
              console.log('Next: ' + next.requireAuth + ' Auth: ' + Auth.isLoggedIn());
              console.log(Auth.getUserData());
                if (next.requireAuth && !Auth.isLoggedIn()) {
                    console.log('DENY');
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
