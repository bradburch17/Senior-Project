(function() {
    'use strict';

    angular
        .module('signoutModule')
        .controller('SignoutController', SignoutController);

    SignoutController.$inject = ['$scope', '$window', '$http', '$state'];

    function SignoutController($scope, $window, $http, $state) {
        $scope.logout = function() {
            $http.get('api/v1/logout')
                .success((data) => {
                    $scope.userData = data.data;
                    console.log('Successful logout');
                    console.log(data);
                    window.localStorage.clear()
                    $state.go('home');
                })
                .error((error) => {
                    console.log('Error: ' + error);
                });
        }
    }
}());
