/*
  Shoe Controller
  Gets current shoes, Create a new shoe, Edit existing shoe, Delete shoe

  Created by bburch
*/
(function() {
    'use strict';

    angular
        .module('shoeModule')
        .controller('ShoeController', ShoeController);

    ShoeController.$inject = ['$scope', '$http', '$window', 'Auth', 'Flash'];

    function ShoeController($scope, $http, $window, Auth, Flash) {
        $scope.shoeData = {};
        $scope.userData = Auth.getUserData();
        $scope.show = false; //Enacted when the user wants to add or edit a PR
        $scope.edit = false; //Tells if user is editing PR
        Flash.clear();
        var data = {};
        getShoes();

        //Gets the user's current shoes
        function getShoes() {
            $http.get('/api/v1/user/' + $scope.userData.person_id + '/shoes/' )
                .success((data) => {
                    $scope.shoes = data.data;
                })
                .error((error) => {
                    console.log(error);
                });
        }

        //Creates a new shoe for the user
        $scope.createShoe = function() {
            //Creates a JSON object for the server
            data = {
                'shoeData': $scope.shoeData,
                'userData': $scope.userData
            };
            $http.post('api/v1/shoes', data)
                .success((data) => {
                    $scope.shoes.push($scope.shoeData); //Angular updates the table to add new shoe
                    $scope.shoeData = data.data;
                    Flash.clear();
                    Flash.create('success', '<strong>Success</strong> You have added a shoe!', 5000, {}, true);
                })
                .error((error) => {
                    console.log(error);
                    Flash.clear();
                    Flash.create('warning', 'Please enter all required information.', 5000, {}, true);
                });
        }

        //Updates an existing shoe
        $scope.updateShoe = function() {
            $http.put('/api/v1/shoes/' + $scope.shoeData.shoe_id, $scope.shoeData)
                .success((data) => {
                    $scope.shoes[$scope.index] = data.data; //Updates the selected shoe in real time
                    Flash.clear();
                    Flash.create('success', 'You have successfully updated your shoe.', 5000, {}, true);
                })
                .error((error) => {
                    console.log(error);
                    Flash.clear();
                    Flash.create('warning', 'Please enter all required information.', 5000, {}, true);
                });
        }

        //Deletes a shoe with window confirmation
        $scope.deleteShoe = function() {
            var confirm = $window.confirm("Are you sure you want to delete this shoe?"); //Popup window asking user to confirm shoe deletion
            //If the user confirms deletion, it deletes the shoe
            if (confirm) {
                $http.delete('/api/v1/shoe/' + $scope.shoeData.shoe_id)
                    .success((data) => {
                        $scope.shoeData = {};
                        $scope.shoes[$scope.index] = {}; //Clears the row where the deleted shoe was
                        Flash.clear();
                        Flash.create('success', 'You have successfully deleted one shoe.', 5000, {}, true);
                    })
                    .error((error) => {
                        console.log(error);
                        Flash.clear();
                        Flash.create('danger', 'You cannot delete this shoe because it has mileage on it.', 5000, {}, true);
                    });
            } else {
                Flash.clear();
                Flash.create('info', 'You chose not to delete the shoe.', 5000, {}, true);
            }
        }

        //Checks if the user is editing or adding a shoe, then calls the appropriate method.
        $scope.submitShoe = function() {
            if (!$scope.edit) {
                $scope.createShoe();
            } else {
                $scope.updateShoe();
            }
        }

        //Hides the Add/Edit shoe form
        $scope.cancel = function() {
            $scope.show = false;
            $scope.edit = false;
            $scope.shoeData = {};
        }

        //Shows the Add Shoe form
        $scope.showAddShoe = function() {
            $scope.show = true;
            $scope.edit = false;
            $scope.shoeData = {};
        }

        //Shows the Edit Shoe form
        $scope.showEditShoe = function(index, shoe) {
            $scope.show = true;
            $scope.edit = true;
            $scope.shoeData = shoe;
            $scope.shoeData.purchasedate = new Date($scope.shoeData.purchasedate); //Makes date a correct date object to fill in date picker element
            $scope.shoeData.maxmileage = parseInt($scope.shoeData.maxmileage); //Parses integer to correctly fill in max mileage number element
            $scope.index = index;
        }
    }
}());
