(function() {
    'use strict';

    angular.module('personalrecordModule')
        .controller('PersonalrecordController', PersonalrecordController);

    PersonalrecordController.$inject = ['$scope', '$http', '$window', 'Auth', 'Flash'];

    function PersonalrecordController($scope, $http, $window, Auth, Flash) {
        $scope.prData = {};
        $scope.userData = Auth.getUserData();
        Flash.clear();
        var data = {};
        $scope.show = false; //Enacted when the user wants to add or edit a PR
        $scope.edit = false; //Tells if user is editing PR
        getPRs();

        function getPRs() {
            $http.get('/api/v1/user/prs/' + $scope.userData.person_id)
                .success((data) => {
                    $scope.prs = data.data;
                    console.log(data.data);
                })
                .error((error) => {
                    console.log(error);
                });
        }

        $scope.cancel = function() {
            $scope.show = false;
            $scope.edit = false;
            $scope.shoeData = {};
        }

        $scope.submitPR = function() {
            if ($scope.edit) {
                $scope.updatePR();
            } else {
                $scope.createPR();
            }
        }

        $scope.showAddPR = function() {
            $scope.show = true;
            $scope.edit = false;
            $scope.prData = {};
        }

        $scope.showEditPR = function(index, pr) {
            $scope.show = true;
            $scope.edit = true;
            $scope.prData = pr;
            $scope.prData.prdate = new Date($scope.prData.prdate);
            $scope.index = index;
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
        }

        $scope.updatePR = function() {
            $http.put('/api/v1/prs/' + $scope.prData.pr_id, $scope.prData)
                .success((data) => {
                    $scope.prs[$scope.index] = data.data;
                    Flash.clear();
                    Flash.create('success', 'You have successfully updated your personal record.', 5000, {}, true);
                })
                .error((error) => {
                    Flash.clear();
                    Flash.create('warning', 'Please enter all required information.', 5000, {}, true);
                    console.log(error);
                });
        }

        $scope.deletePR = function() {
            var confirm = $window.confirm("Are you sure you want to delete this personal record?");
            if (confirm) {
                $http.delete('/api/v1/pr/' + $scope.prData.pr_id)
                    .success((data) => {
                        $scope.prData = {};
                        $scope.prs[$scope.index] = {};
                        console.log(data);
                        Flash.clear();
                        Flash.create('success', 'You have successfully deleted one PR.', 5000, {}, true);
                    })
                    .error((error) => {
                        Flash.clear();
                        Flash.create('danger', 'You cannot delete this personal record.', 5000, {}, true);
                        console.log(error);
                    });
            } else {
                Flash.clear();
                Flash.create('info', 'You chose not to delete the personal record.', 5000, {}, true);
            }
        }
    }
}());
