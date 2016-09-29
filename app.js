(function()
{
  	var app = angular.module('myApp', []);

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
    device: "FitBit",
    teams: "Team Tiger"
	}];
})();
