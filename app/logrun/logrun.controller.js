/*
  Controller for logs
  Get shoes and activities, check if logged into Fitbit, retrieve Fitbit data, create new log

  Created by bburch
*/
(function() {
    'use strict';

    angular
        .module('logrunModule')
        .controller('LogrunController', LogrunController);

    LogrunController.$inject = ['$scope', '$http', 'Auth', 'FitbitFactory', 'Flash'];

    function LogrunController($scope, $http, Auth, FitbitFactory, Flash) {
        $scope.logData = {};
        $scope.userData = Auth.getUserData();
        getActivitiesandShoes();
        Flash.clear();
        var data = {};

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

        //Checks if user is logged into Fitbit
        FitbitFactory.isLoggedIn()
            .then(
                function(data) {
                    $scope.fitbitStatus = data.data.status;
                },
                function(errorData) {
                    console.log(errorData);
                });

        //Retrieves Fitbit data - Just sleep data
        $scope.retrieveData = function() {
            //Makes sure that the date is defined to retrieve Fitbit data
            if ($scope.logData.logdate !== undefined) {
                FitbitFactory.fitbitSleep($scope.logData.logdate)
                    .then(
                        function(data) {
                            var sleepHours = +((data.data.summary.totalMinutesAsleep / 60).toFixed(1)) //Converts sleep minutes to hours with one decimal point
                            $scope.logData.sleep = sleepHours;
                            Flash.clear();
                            Flash.create('success', 'Successfully retrieved Fitbit data', 5000, {}, true);
                        },
                        function(errorData) {
                            console.log(errorData);
                        });
            } else {
                Flash.clear();
                Flash.create('warning', 'Please enter a date', 5000, {}, true);
            }
        }

        //Creates a log
        $scope.createLog = function() {
            //If a user does not enter a shoe, makes shoe_id null for database
            if (angular.isUndefined($scope.logData.shoe)) {
                $scope.logData.shoe = {};
                $scope.logData.shoe.shoe_id = null;
            }

            //Creates JSON object for post request
            data = {
                'logData': $scope.logData,
                'userData': $scope.userData
            };
            $http.post('/api/v1/logs', data)
                .success((data) => {
                    $scope.logData = data.data;
                    Flash.clear();
                    Flash.create('success', '<strong>Success</strong> You have logged an activity!', 5000, {}, true);
                    console.log("Inserted");
                })
                .error((error) => {
                    Flash.clear();
                    Flash.create('warning', 'Please enter all required information.', 5000, {}, true);
                    console.log('Error: ' + error);
                });
        }
    }
}());
