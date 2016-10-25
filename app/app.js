///THIS IS ANGULAR STUFF
(function() {
    var app = angular.module('myApp', ['ui.router' /*, 'userModule', 'loginModule', 'shoeModule', 'prModule', 'logModule'*/ ]);

    app.controller('xuserController', function() {
        this.users = testData;
    });

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
            templateUrl: '/home/partial-home.html'
        })

        .state('about', {
            url: '/about',
            templateUrl: '/about/partial-about.html'
        })

        .state('login', {
            url: '/login',
            templateUrl: '/sign-in/partial-signin.html',
            //controller: 'loginController'
        })

        .state('user-profile', {
            url: '/user-profile',
            templateUrl: '/userprofile/partial-userprofile.html',
            //controller: 'userController'
        })

        .state('register', {
            url: '/register',
            templateUrl: '/sign-up/partial-signup.html',
            //controller: 'registerController'
        })

        .state('forgot-password', {
            url: '/forgot-password',
            templateUrl: 'forgotpass/partial-forgotpass.html',
            abstract: true,
            //controller: 'forgotController'
        })

        .state('log', {
            url: '/log',
            templateUrl: '/logrun/partial-log.html',
            //controller: 'logController'
        })

        .state('shoe', {
            url: '/shoes',
            templateUrl: '/shoe/partial-shoe.html',
            //controller: 'shoeController'
        })

        .state('personalrecord', {
            url: '/personal_records',
            templateUrl: '/personalrecord/partial-personalrecord.html',
            //controller: 'prController'
        })

        //$locationProvider.html5Mode(true); //Removes # from URL. Forces HTML5 Mode.
    });

    app.controller('userController', ($scope, $http) => {
        $scope.formData = {};
        $scope.userData = {};

        $http.get('/api/v1/users')
            .success((data) => {
                $scope.userData = data.data;
                console.log(data.data);
                console.log(data);
            })
            .error((error) => {
                console.log('Error: ' + error);
            });

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
    });

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
      $scope.userData ={};

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
})();
