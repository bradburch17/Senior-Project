(function() {
    'use strict';

    angular
        .module('shoeModule')
        .controller('ShoeController', ShoeController);

    ShoeController.$inject = ['$scope', '$http', 'Auth'];

    function ShoeController($scope, $http, Auth) {
        $scope.shoeData = {};

        $scope.createShoe = function() {
          console.log('Scope: ' + Auth.getUserData());
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
