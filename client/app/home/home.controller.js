(function () {
  'use strict';

  var selfRegistrationLoopBack = angular.module('selfRegistrationLoopBack');

  selfRegistrationLoopBack.controller('HomeCtrl', HomeCtrl);

  selfRegistrationLoopBack.$inject =
    ['appSpinner', 'selfRegistrationLoopBackApi', '$q', '$rootScope', '$state', '$scope', '$interval', 'ngMap'];

    function HomeCtrl($rootScope, $state, selfRegistrationLoopBackApi, $scope, $interval, NgMap, NavigatorGeolocation, GeoCoder) {

    var vm = this;

    vm.currentUser = $rootScope.currentUser; 
	
	vm.map = $rootScope.map;

    vm.getRides = getRides; 

    vm.ridesData = null;

    vm.getRides();
	
	vm.saveRoute = saveRoute;
	
	vm.devicePosition = null;

	vm.startPosition = null;
	
    // Load Signup page
	if ($rootScope.currentUser == null) { 
      $state.go('signup'); 
    }
	
	// Load Map
		NgMap.getMap().then(function(map) {
		vm.map = map; 
	  });
	  
	// Get Device Location
		
		var options = {
			enableHighAccuracy: true
		};
					
		NavigatorGeolocation.getCurrentPosition(function(pos) {
				vm.devicePosition = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
				
				console.log(JSON.stringify(vm.devicePosition));                  
			}, 
			function(error) {                    
				alert('Unable to get location: ' + error.message);
			}, options);
		

	
	// View Device Location
	vm.viewDeviceLocation = function () {
		if (vm.devicePosition !== null) {
			vm.map.setCenter(vm.devicePosition);
		}
		alert('Cannot find Device Location.');
	};
	
	// Start Location Device
	vm.startLocationDevice = function () {	
		if (vm.devicePosition !== null) {
			vm.viewDeviceLocation();
			vm.currentUser.route.start_address = "Your Location";
			vm.startPosition = vm.devicePosition;
		}
		alert('Cannot set Device Location.');
	};	
	// Start Location Input
	function startLocationInput() {
		vm.startPosition = vm.currentUser.route.start_address; 	
	}
	// Geocode Start
	 function geocodeStart() {
		GeoCoder.geocode({address: vm.currentUser.route.start_address}).then(function(result) {
			vm.startPosition = result;
			
			console.log('Address' +JSON.stringify(vm.startPosition)); 
		});	
	};
  	
	// Save Route  
    function saveRoute() { 
        if (vm.currentUser.route.start_address  &&
            vm.currentUser.route.start_address  !== ""  &&
            vm.currentUser.route.end_address  &&
            vm.currentUser.route.end_address  !== "" ) {

          selfRegistrationLoopBackApi
            .saveRoute(vm.currentUser) 
            .then(function(){
               console.log("Route saved!");
			   startLocationInput();
			  getRides();
            });
        }
    }
	// Get Rides
    function getRides() { 
		
		console.log('getRides running.'); 	  
      
	  if (vm.currentUser && vm.currentUser.route) { 
        selfRegistrationLoopBackApi
		.getRides(vm.currentUser)
          .then(function (ridesData) {			  
			vm.ridesData = ridesData.rides;  // populate array 'rides'
			
			console.log('Rides gotten!'); 
		  });
      }
	  
    }
	
	// watch for changes on start address
	$scope.$watch( 'vm.currentUser.route.start_address',
		function(newValue, oldValue){
			console.log('Start Changed');
			console.log('new:' + newValue);
			console.log('old:' + oldValue);
		}
	);
	// watch for changes on start address
	$scope.$watch( 'vm.currentUser.route.end_address',
		function(newValue, oldValue){
			console.log('End Changed');
			console.log('new:' + newValue);
			console.log('old:' + oldValue);
		}
	);
	
	// Sort Rides 
	$scope.sortBy = function(propertyName) {

		$scope.propertyName = propertyName;
	};
	
	//var stopRides; // so that we can cancel updating
	//stopRides = $interval(getRides, 1000);

	// listen on DOM destroy (removal) event, and cancel the next UI update
	// to prevent updating time after the DOM element was removed.
	//$scope.on(getRides(), function() {
	//$interval.cancel(stopRides);
	//});
		  	
	
	}
 
})();
