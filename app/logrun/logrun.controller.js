(function() {
    'use strict';

    angular
        .module('logrunModule')
        .controller('LogrunController', LogrunController);

    LogrunController.$inject = ['$scope', '$http', 'Auth', 'Flash'];

    function LogrunController($scope, $http, Auth, Flash) {
        $scope.logData = {};
        $scope.userData = Auth.getUserData();
        Flash.clear();
        var data = {};

        $scope.createLog = function() {
            data = {
                'logData': $scope.logData,
                'userData': $scope.userData
            };
            $http.post('/api/v1/logs', data)
                .success((data) => {
                    $scope.logData = data.data;
                    Flash.clear();
                    Flash.create('success', '<strong>Success</strong> You have logged an activity!', 5000, {}, true);
                    console.log("Inserted");
                })
                .error((error) => {
                    Flash.clear();
                    Flash.create('warning', 'Please enter all required information.', 5000, {}, true);
                    console.log('Error: ' + error);
                });
        };
    }
}());
