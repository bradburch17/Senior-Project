(function() {
    'use strict';

    angular
        .module('shoeModule')
        .controller('ShoeController', ShoeController);

    ShoeController.$inject = ['$scope', '$http', 'Auth'];

    function ShoeController($scope, $http, Auth) {
        $scope.shoeData = {};
        $scope.userData = Auth.getUserData();
        var data = {};

        $scope.createShoe = function() {
          data = {'shoeData': $scope.shoeData, 'userData': $scope.userData };
            $http.post('api/v1/shoes', data)
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
