/*
  Directive for footer

  Created by bburch
*/
(function() {
    'use strict';

    angular
        .module('layoutModule')
        .directive("xtFooter", function() {
            return {
                restrict: "E",
                templateUrl: "layout/footer/footer.directive.html"
            };
        });
}());
