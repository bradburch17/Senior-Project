(function() {
    'use strict';

    angular
        .module('userprofileModule')
        .controller('UserprofileController', UserprofileController);

    UserprofileController.$inject = ['$scope', '$http'];

    function UserprofileController($scope, $http) {
        $scope.userData = {};

        $http.get('/api/v1/users')
            .success((data) => {
                $scope.userData = data.data;
                console.log(data.data);
            })
            .error((error) => {
                console.log('Error: ' + error);
            });
    }
}());
