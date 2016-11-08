(function() {
  'use strict';

  angular
    .module('forgotpassModule')
    .config(configFunction);

    configFunction.$inject = ['$stateProvider'];
    function configFunction($stateProvider) {
      $stateProvider
      .state('forgot-password', {
          url: '/forgot-password',
          templateUrl: 'forgotpass/forgotpass.html',
          controller: 'ForgotpassController',
          // abstract: true,
          // access: {
          //     restricted: false
          // }
      })
    }

}());
