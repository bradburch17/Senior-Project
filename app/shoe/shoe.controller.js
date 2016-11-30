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
        $scope.show = false; //Enacted when the user wants to add or edit a PR
        $scope.edit = false; //Tells if user is editing PR
        getShoes();

        function getShoes() {
            $http.get('/api/v1/user/shoes/' + $scope.userData.person_id)
                .success((data) => {
                    $scope.shoes = data.data;
                    console.log(data.data);
                })
                .error((error) => {
                    console.log(error);
                });
        }

        $scope.submitShoe = function() {
            if (!$scope.edit) {
                $scope.createShoe();
            } else {
                $scope.updateShoe();
            }
        }

        $scope.cancel = function() {
            $scope.show = false;
            $scope.edit = false;
            $scope.shoeData = {};
        }

        $scope.showAddShoe = function() {
            $scope.show = true;
            $scope.edit = false;
            $scope.shoeData = {};
        }

        $scope.showEditShoe = function(index, shoe) {
            $scope.show = true;
            $scope.edit = true;
            $scope.shoeData = shoe;
            console.log($scope.shoeData);
            $scope.shoeData.purchasedate = new Date($scope.shoeData.purchasedate);
            $scope.shoeData.maxmileage = parseInt($scope.shoeData.maxmileage);
            $scope.index = index;
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
        }

        $scope.updateShoe = function() {
            $http.put('/api/v1/shoes/' + $scope.shoeData.shoe_id, $scope.shoeData)
                .success((data) => {
                    $scope.shoes[$scope.index] = data.data;
                    Flash.clear();
                    Flash.create('success', 'You have successfully updated your shoe.', 5000, {}, true);
                })
                .error((error) => {
                    Flash.clear();
                    Flash.create('warning', 'Please enter all required information.', 5000, {}, true);
                    console.log(error);
                });
        }

        $scope.deleteShoe = function() {
          console.log('HERE');
          console.log($scope.shoeData.shoe_id);
          $http.delete('/api/v1/shoe/' + $scope.shoeData.shoe_id)
              .success((data) => {
                  $scope.shoeData = {};
                  Flash.clear();
                  Flash.create('success', 'You have successfully deleted one shoe.', 5000, {}, true);
              })
              .error((error) => {
                console.log('THERE WAS AN ERROR');
                  Flash.clear();
                  Flash.create('danger', 'You cannot delete this shoe because it has mileage on it.', 5000, {}, true);
                  console.log(error);
              });
        }
    }
}());
