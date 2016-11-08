(function() {
  'use strict';

    angular.module('signinModule')
    .controller('SigninController', SigninController);

    SigninController.$inject = ['$scope', '$http', '$state'];

    function SigninController($scope, $http, $state) {
          $scope.userData = {};


          $scope.loginUser = function() {
                      console.log('Here');
              $http.post('api/v1/login', $scope.userData)
                  .success((data) => {
                      $scope.userData = data.data;
                      console.log('Successful login.');
                      console.log(data);
                      $state.go('home');
                  })
                  .error((error) => {
                      console.log('Error: ' + error);
                  });
          };
      }

}());
