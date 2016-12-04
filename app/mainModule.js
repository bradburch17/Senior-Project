/*
  Main Module

  Created by bburch
*/
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
            //Checks if the user needs to be logged in on any page
            $rootScope.$on('$stateChangeStart', function(event, next) {
                if (next.requireAuth && !Auth.isLoggedIn()) {
                    event.preventDefault();
                    $state.go('login');
                } else if (Auth.isLoggedIn() || !Auth.isLoggedIn()) {
                    //Continue onto page
                }
            });
        }]);

    configFunction.$inject = ['$urlRouterProvider'];

    //Redirects any unknown page to home
    function configFunction($urlRouterProvider) {
        $urlRouterProvider.otherwise('/home');
    }

}());
