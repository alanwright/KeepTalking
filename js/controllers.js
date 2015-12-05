'use strict';

var myApp = angular.module('app.controllers', [])
.controller('AppController', function($scope) {
	$scope.versions = ['1'];
	$scope.selectedVersion = $scope.versions[0];
	
	$scope.resetBombInfo = function() {
		// Global bomb variables
		$scope.globals = {
			hasTwoBatteries: false,
			hasParallelPort: false,
			hasEvenSerial: false,
		};
		$scope.moduleNum = 0;
	};
	
	$scope.resetBombInfo();
	
	// 0 - complex wires
	// 1 - password
	$scope.setModule = function(moduleNum) {
		$scope.moduleNum = moduleNum;
	};
})
.controller('ComplicatedWiresController', function($scope) {
	$scope.wires = [];
	$scope.watches = [];
	
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
		var unbind = $scope.$watch(
			function() { return $scope.wires[len - 1]; },
			function(newVal, oldVal) {
				updateFinalResult(newVal);
			},
			/*objectEquality*/ true);
		
		$scope.watches.push(unbind);
    }
	
	$scope.clearWires = function() {
		$scope.wires = [];
		$scope.watches.forEach(function(unbind) {
			unbind();
		});
		$scope.watches = [];
	};
	
	$scope.getResultClass = function(wire) {
		var simpleResult = getSimpleResult(wire);
		return 'alert alert-' + simpleResultClassMap[simpleResult];
	};
	
	/******
	* Static Functions
	*******/
	
	var resultsMap = {
		'c': 'Cut',
		'd': 'Do NOT Cut',
		's': 'Is the last digit of the serial number even?',
		'p': 'Is there a parallel port?',
		'b': 'Is there at least 2 batteries?',
		'fuck': 'You are fucked',
	};
	
	var simpleResultClassMap = {
		'c': 'success',
		'd': 'danger',
		's': 'info',
		'p': 'info',
		'b': 'info',
		'fuck': 'warning',
	};
	
	var updateFinalResult = function(wire) {
		var simpleResult = getSimpleResult(wire);
		switch (simpleResult) {
			case 's':
				wire.needsSerial = true;
				$scope.globals.needsSerial = true;
				wire.needsParallel = false;
				wire.needsBatteries = false;
				break;
			case 'p':
				wire.needsParallel = true;
				$scope.globals.needsParallel = true;
				wire.needsSerial = false;
				wire.needsBatteries = false;
				break;
			case 'b':
				wire.needsBatteries = true;
				$scope.globals.needsBatteries = true;
				wire.needsSerial = false;
				wire.needsParallel = false;
				break;
			case 'c':
			case 'd':
				wire.needsSerial = false;
				wire.needsParallel = false;
				wire.needsBatteries = false;
				break;
			default:
				console.log('Unknown simple type ' + simpleResult);
				break;
		}
		
		wire.result = resultsMap[simpleResult];
	};
	
	var getSimpleResult = function(wire) {
		var isRed = wire.isRed,
			isBlue = wire.isBlue,
			isStarOn = wire.isStarOn,
			isLedOn = wire.isLedOn,
			hasTwoBatteries = $scope.globals.hasTwoBatteries,
			hasParallelPort = $scope.globals.hasParallelPort,
			hasEvenSerial = $scope.globals.hasEvenSerial;
		
		// cut
		if((!isRed && !isBlue && !isStarOn && !isLedOn)
			|| (!isRed && !isBlue && isStarOn && !isLedOn)
			|| (!isRed && !isBlue && isStarOn && isLedOn)
			|| (needsTwoBatteries(wire) && hasTwoBatteries)
			|| (needsParallelPort(wire) && hasParallelPort)
			|| (needsEvenSerial(wire) && hasEvenSerial))
			return 'c';
		
		// serial number
		if((!isRed && isBlue && !isStarOn && !isLedOn)
			|| (isRed && !isBlue && !isStarOn && !isLedOn)
			|| (isRed && isBlue && !isStarOn && !isLedOn)
			|| (isRed && isBlue && !isStarOn && isLedOn))
			return 's';
		
		// parallel port
		if((!isRed && isBlue && !isStarOn && isLedOn)
			|| (!isRed && isBlue && isStarOn && isLedOn)
			|| (isRed && isBlue && isStarOn && !isLedOn))
			return 'p';
		
		// batteries
		if((!isRed && !isBlue && isStarOn && isLedOn)
			|| (isRed && !isBlue && !isStarOn && isLedOn)
			|| (isRed && !isBlue && isStarOn && isLedOn))
			return 'b';
		
		// don't cut
		if((!isRed && !isBlue && !isStarOn && isLedOn)
			|| (!isRed && isBlue && isStarOn && !isLedOn)
			|| (isRed && isBlue && isStarOn && isLedOn)
			|| (needsTwoBatteries(wire) && !hasTwoBatteries)
			|| (needsParallelPort(wire) && !hasParallelPort)
			|| (needsEvenSerial(wire) && !hasEvenSerial))
			return 'd';
		
		return 'fuck';
	};
	
	var needsEvenSerial = function(wire) {
		var isRed = wire.isRed,
			isBlue = wire.isBlue,
			isStarOn = wire.isStarOn,
			isLedOn = wire.isLedOn;
			
		if((!isRed && isBlue && !isStarOn && !isLedOn)
			|| (isRed && !isBlue && !isStarOn && !isLedOn)
			|| (isRed && isBlue && !isStarOn && !isLedOn)
			|| (isRed && isBlue && !isStarOn && isLedOn))
			return true;
		return false;
	}
	
	var needsTwoBatteries = function(wire) {
		var isRed = wire.isRed,
			isBlue = wire.isBlue,
			isStarOn = wire.isStarOn,
			isLedOn = wire.isLedOn;
			
		if((!isRed && !isBlue && isStarOn && isLedOn)
			|| (isRed && !isBlue && !isStarOn && isLedOn)
			|| (isRed && !isBlue && isStarOn && isLedOn))
			return true;
		return false;
	};
	
	var needsParallelPort = function(wire) {
		var isRed = wire.isRed,
			isBlue = wire.isBlue,
			isStarOn = wire.isStarOn,
			isLedOn = wire.isLedOn;
			
		if((!isRed && isBlue && !isStarOn && isLedOn)
			|| (!isRed && isBlue && isStarOn && isLedOn)
			|| (isRed && isBlue && isStarOn && !isLedOn))
			return true;
		return false;
	};
});