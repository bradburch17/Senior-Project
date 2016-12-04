/*
  Team Controller
  Get team members, Get comments, Post comments

  Created by bburch
*/
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
        getTeamMembers();

        //Gets all team members. Currently does not get users without logs.
        function getTeamMembers() {
            $http.get('/api/v1/team/' + $scope.team_id)
                .success((data) => {
                    $scope.teamData = data.data;
                })
                .error((error) => {
                    console.log(error);
                });
        }

        //Posts a comment on a log
        $scope.saveComment = function(log_id) {
            //Creates JSON object for server
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

        //Edits a comment - CURRENTLY NOT IMPLEMENTED
        $scope.editComment = function(log) {
            $scope.post('/api/v1/log/comment/' + $scope.commentData.comment_id)
                .success((data) => {
                    Flash.clear();
                    Flash.create('success', 'You have successfully added a comment.', 5000, {}, true);
                })
                .error((error) => {
                    console.log(error);
                });
        }

        //Shows the new comment form under specific log
        $scope.showComment = function(logs) {
            $scope.logs = logs.log;
            $scope.show = true;
        }

        //Checks if the log is selected. Prevents new comment form from appearing under every log
        $scope.isSelected = function(logid) {
            if (logid == $scope.logs.log_id) {
                return true;
            }
        }

        //Returns true if the comment belongs to the log.
        $scope.isComment = function(llog, clog) {
            //clog = Comment log ID; llog == Log id
            if (clog == llog) {
                return true;
            }
        }

        //Hides comment form
        $scope.cancel = function(logid) {
            $scope.show = false;
        }
    }
}());
