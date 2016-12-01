(function() {
    'use strict';

    angular
        .module('logrunModule')
        .controller('LogrunController', LogrunController);

    LogrunController.$inject = ['$scope', '$http', '$window', 'Auth', 'FitbitFactory', 'Flash'];

    function LogrunController($scope, $http, $window, Auth, FitbitFactory, Flash) {
        $scope.logData = {};
        $scope.userData = Auth.getUserData();

        getShoes();
        getActivities();

        Flash.clear();
        var data = {};

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

        function getActivities() {
            $http.get('api/v1/activities')
                .success((data) => {
                    $scope.activities = data.data;
                    console.log(data.data);
                })
                .error((error) => {
                    console.log(error);
                })
        }

        FitbitFactory.isLoggedIn()
            .then(
                function(data) {
                    $scope.fitbitStatus = data.data.status;
                },
                function(errorData) {
                    console.log(errorData);
                });

        $scope.retrieveData = function() {
            if ($scope.logData.logdate !== undefined) {
                FitbitFactory.fitbitSleep($scope.logData.logdate)
                    .then(
                        function(data) {
                            var sleepHours = +((data.data.summary.totalMinutesAsleep / 60).toFixed(1))
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

        $scope.createLog = function() {
            var confirm = $window.confirm('Are you sure you want to delete this log?');
            if (confirm) {
                if (angular.isUndefined($scope.logData.shoe)) {
                    $scope.logData.shoe = {};
                    $scope.logData.shoe.shoe_id = null;
                }

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
            } else {
                Flash.clear();
                Flash.create('info', 'You decided not to delete this log.', 5000, {}, true);
            }
        }
    }
}());
