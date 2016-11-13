(function() {
    'use strict';

    angular.module('authModule')
        .controller('AuthController', AuthController);

    AuthController.$inject = ['$scope', '$http', '$state'];

    function AuthController($scope, $http, $state) {
        console.log("here");
        $http.get('/api/v1/auth')
            .success(function(data) {
                $scope.userData = data.data;
                console.log(data.data);
                console.log("Recieved user data");
            })
            .error(function(error) {
                console.log(error);
                $state.go('login');
            })
    }
}());
