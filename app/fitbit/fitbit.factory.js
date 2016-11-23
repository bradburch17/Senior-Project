(function() {
    'use strict';

    angular
        .module('fitbitModule')
        .factory('FitbitFactory', ['$http', '$window', '$state', 'Flash', function authFactory($http, $window, $state, Flash) {
            var factory = {};
            Flash.clear();

            factory.fitbitLogin = function() {
              console.log('We are in the factory');
                $http.get('/api/v1/fitbit')
                    .success((data) => {
                        Flash.clear();
                        Flash.create('success', 'You have successfully logged into FitBit', 5000, {}, true);
                    })
                    .error((error) => {
                        Flash.clear();
                        Flash.create('danger', 'Something went wrong when logging into FitBit.', 5000, {}, true);
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
