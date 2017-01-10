(function () {
  'use strict';

  var selfRegistrationLoopBack = angular.module('selfRegistrationLoopBack');

  selfRegistrationLoopBack.controller('HomeCtrl', HomeCtrl);

  selfRegistrationLoopBack.$inject =
    ['appSpinner', 'selfRegistrationLoopBackApi', '$q', '$rootScope', '$state', '$scope', 'ngMap'];

    function HomeCtrl($rootScope, $state, selfRegistrationLoopBackApi, $scope, NgMap) {

    var vm = this;

    vm.currentUser = $rootScope.currentUser; 

    vm.getRides = getRides; 

    vm.ridesData = null;

    vm.getRides();
	
	vm.saveRoute = saveRoute;
	
	// Show signup page if no current user
    if ($rootScope.currentUser == null) { 
      $state.go('signup'); 
    }
	
	// Load up the Map
	NgMap.getMap().then(function(map) {
		$rootScope.map = map; 
		vm.center = map.getCenter();
		console.log('You are at' + vm.center);
	  });
	  
	// Save current route to Database, if session dies we can recover most recent route.
    function saveRoute() { 

		// TODO: put a timer on this
        if (vm.currentUser.route.start_address  &&
            vm.currentUser.route.start_address  !== ""  &&
            vm.currentUser.route.end_address  &&
            vm.currentUser.route.end_address  !== "" ) {
		// save to the database
          selfRegistrationLoopBackApi
            .saveRoute(vm.currentUser) 
            .then(function(){
               console.log("Route saved!");
			  
            });
        }

    }
	// Grabs rides from Subscriber.remoteMethod in common/models/subscriber.js 
    function getRides() {
		console.log('getRides running.'); 	  
      
	  // check if loggedin and route is set
	  if (vm.currentUser && vm.currentUser.route) { 
        selfRegistrationLoopBackApi
		.getRides(vm.currentUser)
          .then(function (ridesData) {			  
			vm.ridesData = ridesData.rides;  // populate array with the ride data
			
			console.log('rides gotten'); 
		  });
      }
	  
    }
	// watch for changes on the address inputs
	$scope.$watch( 'vm.currentUser.route.start_address',
		function(newValue, oldValue){
			console.log('Start Changed');
			console.log(newValue);
			console.log(oldValue);
		}
	);

	$scope.$watch( 'vm.currentUser.route.end_address',
		function(newValue, oldValue){
			console.log('End Changed');
			console.log(newValue);
			console.log(oldValue);
		}
	);	
	
	}
 
})();
