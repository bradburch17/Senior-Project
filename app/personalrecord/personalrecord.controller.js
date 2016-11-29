(function() {
    'use strict';

    angular.module('personalrecordModule')
        .controller('PersonalrecordController', PersonalrecordController);

    PersonalrecordController.$inject = ['$scope', '$http', 'Auth', 'Flash'];

    function PersonalrecordController($scope, $http, Auth, Flash) {
        $scope.prData = {};
        $scope.userData = Auth.getUserData();
        Flash.clear();
        var data = {};
        $scope.show = false;
        getPRs();

        function getPRs() {
            $http.get('/api/v1/prs/' + $scope.userData.person_id)
                .success((data) => {
                    $scope.prs = data.data;
                    console.log(data.data);
                })
                .error((error) => {
                    console.log(error);
                });
        }

        $scope.showAddPR = function() {
            $scope.show = true;
        }

        $scope.createPR = function() {
            data = {
                'prData': $scope.prData,
                'userData': $scope.userData
            };
            $http.post('/api/v1/prs', data)
                .success((data) => {
                    $scope.prs.push($scope.prData);
                    $scope.prData = data.data;
                    Flash.clear();
                    Flash.create('success', '<strong>Success</strong> You have added a personal record! Congratulations!', 5000, {}, true);
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
