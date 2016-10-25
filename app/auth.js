angular.module('myApp').factory('AuthService', ['$q', '$timeout', '$http', function($q, $timeout, $http) {

            // create user variable
            var user = null;

            // return available functions for use in the controllers
            return ({
                isLoggedIn: isLoggedIn,
                getUserStatus: getUserStatus,
                logout: logout
            });

            function isLoggedIn() {
                if (user)
                    return true
                else
                    return false
            }

            function getUserStatus() {
                return $http.get('api/v1/users')
                    .success(function(data) {
                        if (data.status)
                            user = true;
                        else {
                            user = false;
                        }
                    })
                    .error(function(data) {
                        user = false;
                    });
            }

            function logout() {
                var deferred = $q.defer();

                $http.get('/api/v1/logout')
                    .success(function(data) {
                        user = false;
                        deferred.resolve();
                    })
                    .error(function(data) {
                        user = false;
                        deferred.reject();
                    });
            }
        });
