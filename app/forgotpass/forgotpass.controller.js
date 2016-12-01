(function() {
    'use strict';

    angular
        .module('forgotpassModule')
        .controller('ForgotpassController', ForgotpassController);

    ForgotpassController.$inject = ['$scope', '$http', '$stateParams', 'Flash'];

    function ForgotpassController($scope, $http, $stateParams, Flash) {
        $scope.token = $stateParams.token;
        console.log($stateParams.token);
        $scope.userData = {};

        $scope.forgotPass = function() {
            $http.post('/api/v1/forgotpass', $scope.userData)
                .success((data) => {
                    Flash.clear();
                    Flash.create('info', 'An email has been sent to ' + $scope.userData.email + '. It should arrive momentarily.', 5000, {}, true);
                    $scope.userData = {};
                })
                .error((error) => {
                    Flash.clear();
                    Flash.create('danger', $scope.userData.email + ' is not a registered email address.', 5000, {}, true);
                    console.log(error);
                });
        }

        $scope.updatePassword = function() {
            $http.put('/api/v1/passwordchange/' + $scope.token, $scope.userData)
                .success((data) => {
                    $scope.userData = {};
                    Flash.clear();
                    Flash.create('success', 'Your password was successfuly changed. Please <a ui-sref="login">login.</a>', 5000, {}, true);
                })
                .error((error) => {
                    console.log(error);
                    Flash.clear();
                    Flash.create('danger', 'We could not update your password at this time.', 5000, {}, true);
                });
        }
    }
}());
