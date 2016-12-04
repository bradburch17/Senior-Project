/*
  Factory for authenticating user login and getting user data.

  Created by bburch
*/
(function() {
    'use strict';

    angular
        .module('authModule')
        .factory('Auth', ['$http', '$window', function authFactory($http, $window) {
            var factory = {};

            //Gets user data from local storage.
            factory.getUserData = function() {
                return angular.fromJson(window.localStorage.getItem('userData'));
            }

            //Checks if user is logged in by checking if there is anything in localstorage
            factory.isLoggedIn = function() {
                if (window.localStorage.getItem('userData'))
                    return true;
                else {
                    return false
                }
            }

            //Returns user data in a promise
            factory.getAllUserData = function(id) {
                return $http.get('/api/v1/users/' + id + '/teams');
            }

            return factory;
        }]);

})();
