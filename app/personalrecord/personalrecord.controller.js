/*
  Personal Record Controller
  Gets current PRs, Creates new PRs, Edits existing PRs, Deletes PRs

  Created by bburch
*/
(function() {
    'use strict';

    angular.module('personalrecordModule')
        .controller('PersonalrecordController', PersonalrecordController);

    PersonalrecordController.$inject = ['$scope', '$http', '$window', 'Auth', 'Flash'];

    function PersonalrecordController($scope, $http, $window, Auth, Flash) {
        $scope.prData = {};
        $scope.userData = Auth.getUserData();
        $scope.show = false; //Enacted when the user wants to add or edit a PR
        $scope.edit = false; //Tells if user is editing PR
        Flash.clear();
        var data = {};
        getPRs();

        //Gets current PRs
        function getPRs() {
            $http.get('/api/v1/user/prs/' + $scope.userData.person_id)
                .success((data) => {
                    $scope.prs = data.data;
                })
                .error((error) => {
                    console.log(error);
                });
        }

        //Creates a new PR
        $scope.createPR = function() {
          //Creates a JSON object for server side
            data = {
                'prData': $scope.prData,
                'userData': $scope.userData
            };
            $http.post('/api/v1/prs', data)
                .success((data) => {
                    $scope.prs.push($scope.prData); //Allows Angular model to update after creating PR
                    $scope.prData = data.data;
                    Flash.clear();
                    Flash.create('success', '<strong>Success</strong> You have added a personal record! Congratulations!', 5000, {}, true);
                })
                .error((error) => {
                    Flash.clear();
                    Flash.create('warning', 'Please enter all required information.', 5000, {}, true);
                    console.log(error);
                });
        }

        //Updates an existing PR
        $scope.updatePR = function() {
            $http.put('/api/v1/prs/' + $scope.prData.pr_id, $scope.prData)
                .success((data) => {
                    $scope.prs[$scope.index] = data.data; //Angular updates the PR being edited in real time
                    Flash.clear();
                    Flash.create('success', 'You have successfully updated your personal record.', 5000, {}, true);
                })
                .error((error) => {
                    Flash.clear();
                    Flash.create('warning', 'Please enter all required information.', 5000, {}, true);
                    console.log(error);
                });
        }

        //Deletes a PR with popup window confirmation
        $scope.deletePR = function() {
            var confirm = $window.confirm("Are you sure you want to delete this personal record?"); //Pop up window confirmation for deletion
            //If user confirms deletion then it deletes the PR
            if (confirm) {
                $http.delete('/api/v1/pr/' + $scope.prData.pr_id)
                    .success((data) => {
                        $scope.prData = {};
                        $scope.prs[$scope.index] = {}; //Angular creates an empty row where the deleted PR was
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

        //Hides the edit or add PR form
        $scope.cancel = function() {
            $scope.show = false;
            $scope.edit = false;
            $scope.shoeData = {};
        }

        //Checks if the user is editing or adding a PR, then calls the appropriate method.
        $scope.submitPR = function() {
            if ($scope.edit) {
                $scope.updatePR();
            } else {
                $scope.createPR();
            }
        }

        //Allows the user to see the Add PR form
        $scope.showAddPR = function() {
            $scope.show = true;
            $scope.edit = false;
            $scope.prData = {};
        }

        //Allows the user to see the Edit PR form
        $scope.showEditPR = function(index, pr) {
            $scope.show = true;
            $scope.edit = true;
            $scope.prData = pr;
            $scope.prData.prdate = new Date($scope.prData.prdate); //Converts date to a date format that date picker element can read
            $scope.index = index;
        }
    }
}());
