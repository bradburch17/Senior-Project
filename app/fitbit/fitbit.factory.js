(function() {
    'use strict';

    angular
        .module('fitbitModule')
        .factory('FitbitFactory', ['$http', '$window', '$state', 'Flash', function FitbitFactory($http, $window, $state, Flash) {
            var factory = {};
            var loggedIn = false;
            Flash.clear();

            factory.fitbitLogin = function() {
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

            factory.fitbitSleep = function(date) {
              console.log(date);
              var d = new Date(date);
              var newDate = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
              console.log(newDate);
              return $http.get('/api/v1/fitbit/sleep/' + newDate);
            }

            factory.isLoggedIn = function() {
                return $http.get('/api/v1/fitbit/auth');
            }

            return factory;
        }]);

})();
