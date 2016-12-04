/*
  Factory for Fitbit login, retrieving sleep, and checking login

  Created by bburch
*/
(function() {
    'use strict';

    angular
        .module('fitbitModule')
        .factory('FitbitFactory', ['$http', function FitbitFactory($http) {
            var factory = {};

            //Retrieves sleep information from Fitbit
            factory.fitbitSleep = function(date) {
                var d = new Date(date);
                var newDate = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
                return $http.get('/api/v1/fitbit/sleep/' + newDate);
            }

            //Checks if the user is logged into Fitbit
            factory.isLoggedIn = function() {
                return $http.get('/api/v1/fitbit/auth');
            }

            return factory;
        }]);

})();
