var app = angular.module('starter.directives', []);

app.directive('loadingIndicator', function () {
    return{
        restrict: 'A',
        templateUrl: 'templates/loader.html',
        link: function (scope, element, attrs) {
            scope.$on('loading-started', function (e) {
                element.css('display', 'block');
            });

            scope.$on('loading-complete', function (e) {
                //element.css('display', 'none');
            });
        }
    };
});