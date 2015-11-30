'use strict';

var myApp = angular.module('app.controllers', [])
.controller('ComplicatedWiresController', function($scope) {
	$scope.globals = {
		version: '1',
		twoOrMoreBatteries: false,
		isParallelPort: false,
		serialNumberEven: false,
	};
	$scope.wires = [];
	
	// Watch globals for bomb updates that will need to update wires
	$scope.$watch(
		function() { return $scope.globals; },
		function(newVal, oldVal) {
			$scope.wires.forEach(function(wire) {
				updateFinalResult(wire);
			});
		},
		/*objectEquality*/ true);
	
    $scope.addWire = function() {
        var len = $scope.wires.push({
			isWhite: false,
			isRed: false,
			isBlue: false,
			isStarOn: false,
			isLedOn: false,
			needsSerial: false,
			needsParallel: false,
			needsBatteries: false,
			result: '',
		});
		
		// Watch the wire for any updates and re-evaulate the result
		$scope.$watch(
			function() { return $scope.wires[len - 1]; },
			function(newVal, oldVal) {
				updateFinalResult(newVal);
			},
			/*objectEquality*/ true);
    }
	
	/******
	* Static Functions
	*******/
	
    var resultsMap = {
        'c': 'Cut',
		'd': 'Do NOT Cut',
    };
	
	var updateFinalResult = function(wire) {
		var binary = mapBooleansToBinary(wire.isWhite, wire.isRed, wire.isBlue, wire.isStarOn, wire.isLedOn);
		var simpleResult = getSimpleResult(binary);
		switch (simpleResult) {
			case 's':
				wire.result = 'Needs info';
				wire.needsSerial = true;
				return;
			case 'p':
				wire.result = 'Needs info';
				wire.needsParallel = true;
				return;
			case 'b':
				wire.result = 'Needs info';
				wire.needsBatteries = true;
				return;
			case 'c':
			case 'd':
				wire.result = resultsMap[simpleResult];
				return;
			default:
				console.log('Unknown simple type ' + simpleResult);
				return;
		}
	};
	
	var getSimpleResult = function(binary) {
		switch (binary) {
			case 0:
				return 'c';
			case 1: 
				return 's';
			case 2:
				return 's';
			case 4:
				return 'c';
			case 8:
				return 'd';
			default:
				return 'c';
		}
	};
	
	var mapBooleansToBinary = function(isWhite, isRed, isBlue, isStarOn, isLedOn) {
		var res = 0;
		if (isRed)
			res += 1;
		if (isBlue)
			res += 2;
		if (isStarOn)
			res += 4;
		if (isLedOn)
			res += 8;
		
		return res;
	};
});