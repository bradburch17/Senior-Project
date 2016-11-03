///THIS IS ANGULAR STUFF
(function() {
    var app = angular.module('myApp', ['ui.router' /*, 'userModule', 'loginModule', 'shoeModule', 'prModule', 'logModule'*/ ]);

    app.directive("xtHeader", function() {
        return {
            restrict: "E",
            templateUrl: "navigation/header.html"
        };
    });

    app.directive("xtFooter", function() {
        return {
            restrict: "E",
            templateUrl: "navigation/footer.html"
        };
    });

    //This is how I am routing through the website
    app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
        $urlRouterProvider.otherwise('/home');

        $stateProvider

            .state('home', {
            url: '/home',
            templateUrl: '/home/partial-home.html',
            access: {
                restricted: false
            }
        })

        .state('about', {
            url: '/about',
            templateUrl: '/about/partial-about.html',
            access: {
                restricted: false
            }
        })

        .state('login', {
            url: '/login',
            templateUrl: '/sign-in/partial-signin.html',
            access: {
                restricted: false
            }
            //controller: 'loginController'
        })

        .state('user-profile', {
            url: '/user-profile',
            templateUrl: '/userprofile/partial-userprofile.html',
            access: {
                restricted: true
            }
            //controller: 'userController'
        })

        .state('register', {
            url: '/register',
            templateUrl: '/sign-up/partial-signup.html',
            access: {
                restricted: false
            }
            //controller: 'registerController'
        })

        .state('forgot-password', {
            url: '/forgot-password',
            templateUrl: 'forgotpass/partial-forgotpass.html',
            abstract: true,
            access: {
                restricted: false
            }
            //controller: 'forgotController'
        })

        .state('log', {
            url: '/log',
            templateUrl: '/logrun/partial-log.html',
            access: {
                restricted: true
            }
            //controller: 'logController'
        })

        .state('shoe', {
            url: '/shoes',
            templateUrl: '/shoe/partial-shoe.html',
            access: {
                restricted: true
            }
            //controller: 'shoeController'
        })

        .state('personalrecord', {
            url: '/personal_records',
            templateUrl: '/personalrecord/partial-personalrecord.html',
            access: {
                restricted: true
            }
            //controller: 'prController'
        })

        .state('team', {
            url: '/team',
            templateUrl: '/teamview/partial-teamview.html',
            access: {
                restricted: true
            }
        })

        .state('fitbit', {
            url: '/api/v1/fitbit',
            access: {
                restricted: true
            }
        })

        //$locationProvider.html5Mode(true); //Removes # from URL. Forces HTML5 Mode.
    });

    app.controller('userController', ($scope, $http) => {
        $scope.userData = {};

        $http.get('/api/v1/users')
            .success((data) => {
                $scope.userData = data.data;
                console.log(data.data);
            })
            .error((error) => {
                console.log('Error: ' + error);
            });
    });

    app.controller('userDeleteController', ($scope, $http) => {
        $scope.userData = {};

        $scope.deleteUser = function(person_id) {
            console.log(person_id);
            $http.delete('api/v1/users/' + person_id)
                .success((data) => {
                    $scope.userData = data.data;
                    console.log("Deleted");
                })
                .error((error) => {
                    console.log('Error: ' + error);
                });
        };
    })

    app.controller('loginController', ($scope, $http, $state) => {
        $scope.userData = {};

        $scope.loginUser = function() {
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
    });

    app.controller('shoeController', ($scope, $http) => {
        $scope.shoeData = {};

        $scope.createShoe = function() {
            $http.post('api/v1/shoes', $scope.shoeData)
                .success((data) => {
                    $scope.shoeData = data.data;
                    console.log("Inserted");
                })
                .error((error) => {
                    console.log('Error: ' + error);
                });
        };
    });

    app.controller('prController', ($scope, $http) => {
        $scope.prData = {};

        $scope.createPR = function() {
            $http.post('/api/v1/prs', $scope.prData)
                .success((data) => {
                    $scope.prData = data.data;
                    console.log("Inserted");
                })
                .error((error) => {
                    console.log('Error: ' + error);
                });
        };
    });

    app.controller('logController', ($scope, $http) => {
        $scope.logData = {};

        $scope.createLog = function() {
            $http.post('/api/v1/logs', $scope.logData)
                .success((data) => {
                    $scope.logData = data.data;
                    console.log("Inserted");
                })
                .error((error) => {
                    console.log('Error: ' + error);
                });
        };
    });

    app.controller('teamViewController', ($scope, $http) => {
        $scope.teamData = {};

        $http.get('/api/v1/team')
            .success((data) => {
                $scope.teamData = data.data;
                console.log(data);
                console.log(data.data);
            })
            .error((error) => {
                console.log('Error: ' + error);
            });
    });

    app.controller('registerController', ($scope, $http) => {
        $scope.userData = {};

        $scope.createUser = function() {
            $http.post('/api/v1/register', $scope.userData)
                .success((data) => {
                    $scope.userData = data.data;
                    console.log("Inserted");
                })
                .error((error) => {
                    console.log('Error: ' + error);
                });
        };
    });

    app.controller('loginController', ($scope, $http, $location) => {
        $scope.userData = {};

        $scope.login = function() {
            $http.post('/api/v1/login', $scope.userData)
                .success((data) => {
                    $scope.userData = data.data;
                    console.log("Logged In");
                    $location.path('#/home');
                })
                .error((error) => {
                    console.log('Error: ' + error);
                });
        };
    });

    app.controller('authController', ($scope, $http, $location) => {
        $scope.userData = {};

        $scope.authenticated = function() {
            $http.get('/api/v1/auth', $scope.userData)
                .success((data) => {
                    $scope.userData = data.data;
                    console.log("Authenticated");
                })
                .error((error) => {
                    console.log('User not authenticated: ' + error);
                    $location.path('#/login');
                });
        };
    });

    app.controller('fitbitController', ($scope, $http) => {
        $scope.fitbitData = {};

        $http.get('/api/v1/user', $scope.fitbitData)
            .success((data) => {
                $scope.fitbitData = data;
                console.log(data);
                console.log(data.data);
            })
            .error((error) => {
                console.log('Error: ' + error);
            });
    });

    app.controller('fitbitActivityController', ($scope, $http) => {
        $scope.fitbitData = {};
        var currentDate = new Date();
        var day = currentDate.getDate();
        var month = currentDate.getMonth() + 1;
        var year = currentDate.getFullYear();
        var date = year + '/' + day + '/' + month;
        
        $http.get('https://api.fitbit.com/1/user/-/activities/date/' + date + '.json', $scope.fitbitData)
            .success((data) => {
                $scope.fitbitData = data;
                console.log(data);
                console.log(data.data);
            })
            .error((error) => {
                console.log('Error: ' + error);
            });
    });
    /*
            app.run('routeChange', ($rootScope, $location, $route, AuthService) => {
                $rootScope.$on('$routeChangeStart', function(event, next, current) {
                        AuthService.getUserStatus()
                            .then(function() {
                                if (/*next.access.restricted && *-/!AuthService.isLoggedIn()) {
                                    $location.path('#/login');
                                    $route.reload();
                                }
                            });
                    });
            });


            app.factory('AuthService', ($q, $timeout, $http) => {
                console.log("I'm in the auth service");
                    // create user variable
                    var user = null;

                    // return available functions for use in the controllers
                    return ({
                        isLoggedIn: isLoggedIn,
                        getUserStatus: getUserStatus
                    });

                    var isLoggedIn = function() {
                        if (user) {
                            return true;
                        } else {
                            return false;
                        }
                    }

                    var getUserStatus = function() {
                        return $http.get('api/v1/auth')
                            .success((data) => {
                                if (data.status)
                                    user = true;
                                else {
                                    user = false;
                                }
                            })
                            .error((error) => {
                                user = false;
                            });
                    }
                });
    */
})();
