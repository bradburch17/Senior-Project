(function() {
    'use strict';

    angular
        .module('userprofileModule')
        .config(configFunction);

    configFunction.$inject = ['$stateProvider'];

    function configFunction($stateProvider) {
        $stateProvider
            .state('user-profile', {
                url: '/userprofile',
                templateUrl: '/userprofile/userprofile.html',
                controller: 'UserprofileController',
                requireAuth: true,
            })

            .state('edit-profile', {
              url:'/userprofile/edit',
              templateUrl: '/userprofile/edit-userprofile.html',
              controller: 'UserprofileController',
              requireAuth: true,
            })
    }
})();
