//NOT IN USE
{
  angular.module('header').directive("xtHeader", function() {
      return {
          restrict: "E",
          templateUrl: "navigation/header.html"
      };
  });

  angular.module('footer').directive("xtFooter", function() {
      return {
          restrict: "E",
          templateUrl: "navigation/footer.html"
      };
  });

}
