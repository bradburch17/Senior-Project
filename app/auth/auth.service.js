(function() {
    'use strict';

    angular
        .module('authModule')
        .factory('Auth', ['$http', '$window', '$state', function authFactory($http, $window, $state) {
            var factory = {};

            var userData = {};

            factory.getUserData = function() {
                // $http.get('/api/v1/auth')
                //     .success(function(data) {
                //         if (data.status == true) {
                //             console.log("User data is true");
                //             userData = data.data;
                //         } else {
                //             console.log("User data is false");
                //             userData = {};
                //         }
                //     })
                //     .error(function(error) {
                //         console.log(error);
                //         userData = {};
                //     });
                //     console.log(userData);
                // return userData;
                return angular.fromJson(window.localStorage.getItem('userData'));
            }

            factory.isLoggedIn = function() {
                // $http.get('/api/v1/auth')
                //     .success(function(data) {
                //         if (data.status == true) {
                //             console.log("User data is true");
                //             loggedIn = true;
                //         } else {
                //             console.log("User data is false");
                //             loggedIn = false;
                //         }
                //     })
                //     .error(function(error) {
                //         console.log(error);
                //         loggedIn = false;
                //     });
                // return loggedIn;
                if (window.localStorage.getItem('userData'))
                  return true;
                else {
                  return false
                }
            }

            return factory;
        }]);

})();
