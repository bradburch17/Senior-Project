(function() {
    'use strict';

    angular
        .module('logrunModule')
        .controller('LogrunController', LogrunController);

    LogrunController.$inject = ['$scope', '$http', 'Auth'];

    function LogrunController($scope, $http, Auth) {
        $scope.logData = {};
        $scope.userData = Auth.getUserData();
        var data = {};

        $scope.createLog = function() {
          data = {'logData': $scope.logData, 'userData': $scope.userData };
            $http.post('/api/v1/logs', data)
                .success((data) => {
                    $scope.logData = data.data;
                    console.log("Inserted");
                })
                .error((error) => {
                    console.log('Error: ' + error);
                });
        };
    }
}());
