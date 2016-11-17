(function() {
    'use strict';

    angular
        .module('fitbitModule')
        .controller('FitbitLoginController', FitbitLoginController);

    FitbitLoginController.$inject = ['$http', '$scope'];

    function FitbitLoginController($http, $scope) {
        $scope.fitbitLogin() = function() {
          console.log('We are here');
            $http.get('/api/v1/fitbit')
                .success((data) => {
                    console.log('Did it redirect?');
                })
                .error((error) => {
                    console.log(error);
                });
        }
    }

}());
