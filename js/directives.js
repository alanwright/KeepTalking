'use strict';

var myApp = angular.module('app.directives', [])
.directive('complicatedWire', function() {
    return {
        restrict: 'E',
        templateUrl: '../templates/complicatedWire.html',
    };
})
.directive('complicatedWireResult', function() {
    return {
        restrict: 'E',
        templateUrl: '../templates/complicatedWireResult.html',
    };
});