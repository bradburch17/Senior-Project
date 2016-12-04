/*
  User Profile controller
  Get user logs, Get user information

  Created by bburch
*/
(function() {
    'use strict';

    angular
        .module('userprofileModule')
        .controller('UserprofileController', UserprofileController);

    UserprofileController.$inject = ['$http', '$scope', '$location', '$window', 'Auth', 'FitbitFactory', 'Flash'];

    function UserprofileController($http, $scope, $location, $window, Auth, FitbitFactory, Flash) {
        $scope.userData = Auth.getUserData();
        $scope.showLogs = false;
        $scope.showEdit = false;
        Flash.clear();
        getLogs();
        getActivitiesandShoes();
        isFitbitLogin();

        //Gets all logs by the user
        function getLogs() {
            $http.get('api/v1/user/' + $scope.userData.person_id + '/logs')
                .success((data) => {
                    $scope.logs = data.data;
                })
                .error((error) => {
                    console.log(error);
                })
        }

        //Gets all activites and shoes that belong to the user and not restricted
        function getActivitiesandShoes() {
            $http.get('/api/v1/logs/info/' + $scope.userData.person_id)
                .success((data) => {
                    $scope.logData.shoes = data.shoes;
                    $scope.logData.activities = data.activities;
                })
                .error((error) => {
                    console.log(error);
                })
        }

        //Updates a log
        $scope.updateLog = function() {
            $http.put('/api/v1/logs/' + $scope.logData.log_id, $scope.logData)
                .success((data) => {
                    $scope.logs[$scope.index] = data.data; //Updates log in real time
                    Flash.clear();
                    Flash.create('success', 'You have successfully updated your log.', 5000, {}, true);
                })
                .error((error) => {
                    Flash.clear();
                    Flash.create('warning', 'Please enter all required information.', 5000, {}, true);
                    console.log(error);
                });
        }

        //Deletes a log with window confirmation
        $scope.deleteLog = function() {
            var confirm = $window.confirm("Are you sure you want to delete this log?"); //Popup window confirmation
            if (confirm) {
                $http.delete('/api/v1/logs/' + $scope.logData.log_id)
                    .success((data) => {
                        $scope.logData = {};
                        $scope.logs[$scope.index] = {}; //Clears the line where the log was
                        Flash.clear();
                        Flash.create('success', 'You have successfully deleted one log.', 5000, {}, true);
                    })
                    .error((error) => {
                        console.log(error);
                        Flash.clear();
                        Flash.create('danger', 'You cannot delete this log.', 5000, {}, true);
                    });
            } else {
                Flash.clear();
                Flash.create('info', 'You chose not to delete this log.', 5000, {}, true);
            }
        }

        //Checks if Fitbit is logged in to hide 'Login to Fitbit' button
        function isFitbitLogin() {
            FitbitFactory.isLoggedIn()
                .then(
                    function(data) {
                        $scope.fitbitStatus = data.data.status;
                    },
                    function(errorData) {
                        console.log(errorData);
                    });
        }

        //Shows all logs by the user
        $scope.showLogs = function() {
            if (!$scope.showLog) {
                $scope.showLog = true;
                $scope.showEdit = false;
            } else {
                $scope.showLog = false;
                $scope.showEdit = false;
            }
        }

        //Shows the Edit Log form
        $scope.editLog = function(index, log) {
            $scope.showEdit = true;
            $scope.logData = log;
            $scope.index = index;
            $scope.logData.logdate = new Date($scope.logData.logdate); //Converts date to fill in date element
            $scope.logData.distance = parseInt($scope.logData.distance); //Parses integer to correctly fill in mileage number element
            $scope.logData.sleep = parseInt($scope.logData.sleep); //Parses integer to correctly fill in sleep number element
            $scope.logData.heartrate = parseInt($scope.logData.heartrate); //Parses integer to correctly fill in heartrate number element
        }

        //Hides the Edit Log form
        $scope.cancel = function() {
            $scope.showEdit = false;
        }
    }
}());
