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
              templateUrl: '/userprofile/edit-profile/edit-userprofile.html',
              controller: 'EditProfileController',
              requireAuth: true,
            })

            .state('other-profile', {
              url:'/userprofile/:person_id',
              templateUrl: '/userprofile/userprofile.html',
              controller: 'UserprofileController',
              requireAuth: true,
            })
    }
})();
