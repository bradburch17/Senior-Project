(function() {
    'use strict';

    angular
        .module('userprofileModule')
        .controller('UserprofileController', UserprofileController);

    UserprofileController.$inject = ['$http', '$scope', '$location', '$window', 'Auth', 'FitbitFactory', 'Flash'];

    function UserprofileController($http, $scope, $location, $window, Auth, FitbitFactory, Flash) {
        $scope.newuserData = Auth.getUserData();
        $scope.showLogs = false;
        $scope.showEdit = false;
        getLogs();
        getShoes();
        getActivities();

        function getLogs() {
            $http.get('api/v1/user/' + $scope.userData().person_id + '/logs')
                .success((data) => {
                    console.log(data.data);
                    $scope.logs = data.data;
                })
                .error((error) => {
                    console.log(error);
                })
        }

        function getShoes() {
            $http.get('/api/v1/user/shoes/' + $scope.userData().person_id)
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

        $scope.userData = function() {
            return Auth.getUserData();
        }

        $scope.showLogs = function() {
            if (!$scope.showLog) {
                $scope.showLog = true;
                $scope.showEdit = false;
            } else {
                $scope.showLog = false;
                $scope.showEdit = false;
            }
        }

        $scope.editLog = function(index, log) {
            $scope.showEdit = true;
            $scope.logData = log;
            $scope.index = index;
            $scope.logData.logdate = new Date($scope.logData.logdate);
        }

        $scope.cancel = function() {
            $scope.showEdit = false;
        }

        FitbitFactory.isLoggedIn()
            .then(
                function(data) {
                    console.log(data.data.status);
                    $scope.fitbitStatus = data.data.status;
                },
                function(errorData) {
                    console.log(errorData);
                });

        $scope.updateLog = function() {
            $http.put('/api/v1/logs/' + $scope.logData.log_id, $scope.logData)
                .success((data) => {
                    $scope.logs[$scope.index] = data.data;
                    Flash.clear();
                    Flash.create('success', 'You have successfully updated your log.', 5000, {}, true);
                })
                .error((error) => {
                    Flash.clear();
                    Flash.create('warning', 'Please enter all required information.', 5000, {}, true);
                    console.log(error);
                });
        }

        $scope.deleteLog = function() {
            $http.delete('/api/v1/logs/' + $scope.logData.log_id)
                .success((data) => {
                    $scope.logData = {};
                    $scope.logs[$scope.index] = {};
                    console.log(data);
                    Flash.clear();
                    Flash.create('success', 'You have successfully deleted one log.', 5000, {}, true);
                })
                .error((error) => {
                    Flash.clear();
                    Flash.create('danger', 'You cannot delete this log.', 5000, {}, true);
                    console.log(error);
                });
        }
    }
}());
