///THIS IS ANGULAR STUFF
(function()
{
  	var app = angular.module('myApp', ['ui.router']);

  	app.controller('UserController', function()
  	{
  		this.users = testData;
  	});

	app.directive("xtHeader", function() {
	    return {
	        restrict : "E",
	        templateUrl : "partials/header.html"
	    };
	});

	app.directive("xtFooter", function() {
	    return {
	        restrict : "E",
	        templateUrl : "partials/footer.html"
	    };
	});

  app.config(function($stateProvider, $urlRouterProvider)
  {
      $urlRouterProvider.otherwise('/home');

      $stateProvider

      .state('home',
      {
        url: '/home',
        templateUrl: 'home/partial-home.html'
      })

      .state('about',
      {
        url: '/about',
        templateUrl: '/about/partial-about.html'
      })

      .state('sign-in',
      {
        url: '/sign-in',
        templateUrl: '/sign-in/partial-signin.html'
      })

      .state('user-profile',
      {
        url: '/user-profile',
        templateUrl: '/userprofile/partial-userprofile.html'
      })

      .state('register',
      {
        url: '/register',
        templateUrl: '/sign-up/partial-signup.html'
      })

    });

	var testData =
	[{
		name: "Bradley Burch",
    username: "bradburch",
		sex: "Male",
		shoe: "Brooks Ravenna 6",
		prs:
		{
			"Cross Country": "29:00",
			Mile: "4:48",
		},
    images:
    [
      {
        profile: "images/bradburch.jpg",
      },
    ],
    device: "FitBit",
    teams: "Team Tiger"
	}];
})();
