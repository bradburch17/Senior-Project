(function() {
    'use strict';

    angular
        .module('shoeModule')
        .controller('ShoeController', ShoeController);

    ShoeController.$inject = ['$scope', '$http', 'Auth', 'Flash'];

    function ShoeController($scope, $http, Auth, Flash) {
        $scope.shoeData = {};
        $scope.userData = Auth.getUserData();
        Flash.clear();
        var data = {};
        $scope.show = false;
        getShoes();

        function getShoes() {
            $http.get('/api/v1/shoes/' + $scope.userData.person_id)
                .success((data) => {
                    $scope.shoes = data.data;
                    console.log(data.data);
                })
                .error((error) => {
                    console.log(error);
                });
        }

        $scope.showAddShoe = function() {
          $scope.show = true;
        }

        $scope.createShoe = function() {
            data = {
                'shoeData': $scope.shoeData,
                'userData': $scope.userData
            };
            $http.post('api/v1/shoes', data)
                .success((data) => {
                  $scope.shoes.push($scope.shoeData);
                    $scope.shoeData = data.data;
                    Flash.clear();
                    Flash.create('success', '<strong>Success</strong> You have added a shoe!', 5000, {}, true);
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
