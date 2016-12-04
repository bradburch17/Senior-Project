/*
  Sign up Conroller

  Created by bburch
*/
(function() {
    'use strict';

    angular
        .module('signupModule')
        .controller('SignupController', SignupController);

    SignupController.$inject = ['$scope', '$http', '$state', 'Flash'];

    function SignupController($scope, $http, $state, Flash) {
        $scope.userData = {};
        Flash.clear();

        //Signs a user up for the site
        $scope.createUser = function() {
            $http.post('/api/v1/register', $scope.userData)
                .success((data) => {
                    $scope.userData = data.data;
                    Flash.clear();
                    Flash.create('success', '<strong>Success</strong> Your account was created successfully. Please <a ui-sref="login">login.</a>', 0, {}, false);
                })
                .error((error) => {
                    Flash.clear();
                    //Checks what type of error and responds with correct flash message
                    if (error == 'Bad Request') {
                        Flash.create('warning', 'Please fill out all information.', 0, {}, false);
                    }
                    else if (error == 'Unauthorized') {
                        Flash.create('warning', 'The username already exists. Please choose another username.', 0, {}, false);
                    }
                    console.log(error);
                });
        };
    }
}());
