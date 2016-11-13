(function() {
    'use strict';

    angular
        .module('layoutModule')
        .directive("xtHeader", function() {
            return {
                restrict: "E",
                templateUrl: "layout/navbar/navbar.directive.html"
            };
        });
}());
