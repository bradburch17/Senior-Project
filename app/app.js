///THIS IS ANGULAR STUFF
(function() {
    var app = angular.module('myApp', ['ui.router']);

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
    app.config(function($stateProvider, $urlRouterProvider) {
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

        .state('sign-in', {
            url: '/sign-in',
            templateUrl: '/sign-in/partial-signin.html'
        })

        .state('user-profile', {
            url: '/user-profile',
            templateUrl: '/userprofile/partial-userprofile.html'
        })

        .state('register', {
            url: '/register',
            templateUrl: '/sign-up/partial-signup.html'
        })

        .state('log', {
            url: '/log',
            templateUrl: '/logrun/partial-log.html'
        })

        .state('shoe', {
            url: '/shoes',
            templateUrl: '/shoe/partial-shoe.html'
        })

        .state('personalrecord', {
          url: '/personal_records',
          templateUrl: '/personalrecord/partial-personalrecord.html'
        })

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

        $scope.createUser = function(person_id) {
            $http.post('api/v1/users', $scope.formData)
                .success((data) => {
                    $scope.formData = {};
                    $scope.todoData = data.data;
                    console.log(data.data);
                })
                .error((error) => {
                    console.log('Error: ' + error);
                });
        };

        $scope.deleteUser = function(person_id) {
            $http.delete('api/v1/users/' + person_ID)
                .success((data) => {
                    $scope.userData = data.data;
                    console.log(data.data);
                })
                .error((error) => {
                    console.log('Error: ' + error);
                });
        };
    });

    // var testData = [{
    //     name: "Bradley Burch",
    //     username: "bradburch",
    //     sex: "Male",
    //     shoe: "Brooks Ravenna 6",
    //     prs: [{
    //         "Cross Country": "29:00",
    //     }, {
    //         Mile: "4:48",
    //     }, ],
    //     images: [{
    //         profile: "images/bradburch.jpg",
    //     }, ],
    //     device: "FitBit",
    //     teams: "Team Tiger"
    // }];
})();
