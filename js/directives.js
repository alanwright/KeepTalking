'use strict';

var myApp = angular.module('app.directives', [])
.directive('bombInfo', function() {
    return {
        restrict: 'E',
        templateUrl: '../templates/bombInfo.html',
    };
})
.directive('complicatedWires', function() {
	return {
		restrict: 'E',
		scope: {
			selectedVersion: '=',
			globals: '=',
		},
		templateUrl: '../templates/complicatedWires.html',
	};
})
.directive('complicatedWire', function() {
    return {
        restrict: 'C',
        templateUrl: '../templates/complicatedWire.html',
    };
})
.directive('complicatedWireResult', function() {
    return {
        restrict: 'E',
        templateUrl: '../templates/complicatedWireResult.html',
    };
})
.directive('bombInput', function() {
    return {
        restrict: 'E',
        templateUrl: '../templates/bombInput.html',
    };
})
.directive('passwordsInput', function() {
    return {
        restrict: 'E',
        templateUrl:
    };
})
.directive('passwordBank', function() {
    return {
        
    };
});