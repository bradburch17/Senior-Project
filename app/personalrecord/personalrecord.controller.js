(function() {
    'use strict';

    angular.module('personalrecordModule')
        .controller('PersonalrecordController', PersonalrecordController);

    PersonalrecordController.$inject = ['$scope', '$http'];

    function PersonalrecordController($scope, $http) {
        $scope.prData = {};

        $scope.createPR = function() {
            $http.post('/api/v1/prs', $scope.prData)
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
