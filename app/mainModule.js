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
    'teamModule',
    'userprofileModule',


  ])
  .config(configFunction);

  configFunction.$inject = ['$urlRouterProvider'];

  function configFunction($urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');
  }

}());
