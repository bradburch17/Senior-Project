(function() {
    'use strict';

    angular.module('personalrecordModule')
        .controller('PersonalrecordController', PersonalrecordController);

    PersonalrecordController.$inject = ['$scope', '$http', 'Auth'];

    function PersonalrecordController($scope, $http, Auth) {
        $scope.prData = {};
        $scope.userData = Auth.getUserData();
        var data = {};

        $scope.createPR = function() {
          data = {'prData': $scope.prData, 'userData': $scope.userData };
            $http.post('/api/v1/prs', data)
                .success((data) => {
                    $scope.prData = data.data;
                    console.log("Inserted");
                })
                .error((error) => {
                    console.log('Error: ' + error);
                });
        };
    }
}());
