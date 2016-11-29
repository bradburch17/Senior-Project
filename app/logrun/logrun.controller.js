(function() {
    'use strict';

    angular
        .module('logrunModule')
        .controller('LogrunController', LogrunController);

    LogrunController.$inject = ['$scope', '$http', 'Auth', 'FitbitFactory', 'Flash'];

    function LogrunController($scope, $http, Auth, FitbitFactory, Flash) {
        $scope.logData = {};
        $scope.userData = Auth.getUserData();

        getShoes();

        Flash.clear();
        var data = {};

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
                            var sleepHours = +((data.data.summary.totalMinutesAsleep/60).toFixed(1))
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
        };
    }
}());
