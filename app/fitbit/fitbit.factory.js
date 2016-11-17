(function() {
    'use strict';

    angular
        .module('fitbitModule')
        .factory('FitbitFactory', ['$http', '$window', '$state', function authFactory($http, $window, $state) {
            var factory = {};

            factory.fitbitLogin = function() {
              console.log('Here');
              $http.get('/api/v1/fitbit')
                  .success((data) => {
                      console.log('Did it redirect?');
                  })
                  .error((error) => {
                      console.log(error);
                  });
            }

            factory.fitbitSleep = function() {

            }

            factory.isLoggedIn = function() {

            }

            factory.setLoggedIn = function(val) {
              loggedIn = val;
            }

            return factory;
        }]);

})();
