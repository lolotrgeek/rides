(function () {
  'use strict';

  var selfRegistrationLoopBack = angular.module('selfRegistrationLoopBack');

  selfRegistrationLoopBack.controller('HomeCtrl', HomeCtrl);

  selfRegistrationLoopBack.$inject =
    ['appSpinner', 'selfRegistrationLoopBackApi', '$q', '$rootScope', '$state', '$scope', '$interval', 'ngMap'];

    function HomeCtrl($rootScope, $state, selfRegistrationLoopBackApi, $scope, $interval, NgMap, NavigatorGeolocation, GeoCoder, Attr2MapOptions) {

    var vm = this;

    vm.currentUser = $rootScope.currentUser; 
	
	vm.map = $rootScope.map;

    vm.getRides = getRides; 

    vm.ridesData = null;

    vm.getRides();
	
	vm.saveRoute = saveRoute;
		
    // Load Signup page
	if ($rootScope.currentUser == null) { 
      $state.go('signup'); 
    }
	
	
	// Load Map
		NgMap.getMap().then(function(map) {
		vm.map = map; 
	  });
	
	// Save Route  
    function saveRoute() { 
        if (vm.currentUser.route.start_address  &&
            vm.currentUser.route.start_address  !== ""  &&
            vm.currentUser.route.end_address  &&
            vm.currentUser.route.end_address  !== "" ) {
				
			vm.zoom = vm.map.getZoom(); 
			console.log('zoom:' + vm.zoom);
			vm.center = vm.map.getCenter();
			console.log('center:' +vm.center);

          selfRegistrationLoopBackApi
            .saveRoute(vm.currentUser) 
            .then(function(){
               console.log("Route saved!");
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
		  	
	//Clear destination
	
	
	//Select Ride
	function selectRide() {
		
		
	}
	
	}
 
})();
