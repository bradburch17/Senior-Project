(function() {
    'use strict';

    angular
        .module('teamModule')
        .controller('TeamController', TeamController);

    TeamController.$inject = ['$scope', '$http', '$stateParams', 'Auth', 'Flash'];

    function TeamController($scope, $http, $stateParams, Auth, Flash) {
        $scope.team_id = $stateParams.id;
        $scope.userData = Auth.getUserData();
        $scope.teamData = {};
        $scope.commentData = {};
        $scope.logs = {};
        $scope.show = true;
        Flash.clear();

        $http.get('/api/v1/team/' + $scope.team_id)
            .success((data) => {
                $scope.teamData = data.data;
                console.log(data.data);
            })
            .error((error) => {
                console.log(error);
            });

        $scope.showComment = function(logs) {
            console.log(logs);
            $scope.logs = logs.log;
            $scope.show = true;
        }

        $scope.isSelected = function(logid) {
            if (logid == $scope.logs.log_id) {
                return true;
            }
        }

        $scope.isComment = function(llog, clog) {
          console.log(clog + ' ' + llog);
          if (clog == llog) {
            return true;
          }
        }

        $scope.cancel = function(logid) {
            $scope.show = false;
        }

        $scope.saveComment = function(log_id) {
            var data = {
                userData: $scope.userData,
                commentData: $scope.commentData
            }

            $http.post('/api/v1/log/comment/' + log_id, data)
                .success((data) => {
                    $scope.commentData = {};
                    Flash.clear();
                    Flash.create('success', 'You have successfully added a comment.', 5000, {}, true);
                })
                .error((error) => {
                    console.log(error);
                });
        }

        $scope.editComment = function(log) {
            $scope.post('/api/v1/log/comment/' + $scope.commentData.comment_id)
                .success((data) => {
                    console.log(data.data);
                    Flash.clear();
                    Flash.create('success', 'You have successfully added a comment.', 5000, {}, true);
                })
                .error((error) => {
                    console.log(error);
                });
        }

    }
}());
