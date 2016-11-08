(function() {
  'use strict';

  angular
    .module('shoeModule')
    .controller('ShoeController', ShoeController);

    ShoeController.$inject = ['$scope', '$http'];
    function ShoeController($scope, $http) {
      $scope.shoeData = {};

      $scope.createShoe = function() {
        $http.post('api/v1/shoes', $scope.shoeData)
        .success((data) => {
          $scope.shoeData = data.data;
          console.log("Inserted");
        })
        .error((error) => {
          console.log('Error: ' + error);
        });
      };
    }

}());
