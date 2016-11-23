(function() {
    'use strict';

    angular
        .module('fitbitModule')
        .controller('FitbitLoginController', FitbitLoginController);

    FitbitLoginController.$inject = ['$http', '$scope', 'Flash'];

    function FitbitLoginController($http, $scope, Flash) {

        $scope.fitbitLogin() = function() {
          console.log('We are in the controller');
            $http.get('/api/v1/fitbit')
                .success((data) => {
                    Flash.clear();
                    Flash.create('success', 'You have logged into FitBit.', 5000, {}, true);
                })
                .error((error) => {
                  Flash.clear();
                  Flash.create('danger', 'Something went wrong trying to connect to FitBit. Try again!', 5000, {}, true);
                    console.log(error);
                });
        }
    }

}());
