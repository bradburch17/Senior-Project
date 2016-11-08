(function() {
  'use strict';

  angular
    .module('logrunModule')
    .controller('LogrunController', LogrunController);

    LogrunController.$inject = ['$scope', '$http'];
    function LogrunController($scope, $http) {
      $scope.logData = {};

      $scope.createLog = function() {
        $http.post('/api/v1/logs', $scope.logData)
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
