(function () {
  'use strict';

  var selfRegistrationLoopBack = angular.module('selfRegistrationLoopBack');

  selfRegistrationLoopBack.controller('HomeCtrl', HomeCtrl);

  selfRegistrationLoopBack.$inject =
    ['appSpinner', 'selfRegistrationLoopBackApi', '$q', '$rootScope', '$state', '$scope'];

  function HomeCtrl($rootScope, $state, selfRegistrationLoopBackApi, $scope) {

    var vm = this;

    vm.currentUser = $rootScope.currentUser; //define the session

    vm.getRides = getRides; 

    vm.ridesData = null;

    vm.getRides();
	
	vm.saveRoute = saveRoute;
	
    if ($rootScope.currentUser == null) { //Show signup page if no session
      $state.go('signup');
    }

		//Listen for changes on the address inputs
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
		
    function saveRoute() {
        if (vm.currentUser.route.start_address  &&
            vm.currentUser.route.start_address  !== ""  &&
            vm.currentUser.route.end_address  &&
            vm.currentUser.route.end_address  !== "" ) {

          selfRegistrationLoopBackApi
            .saveRoute(vm.currentUser)
            .then(function(){
               console.log("Route saved!");
			  
            });
        }

    }
	
    function getRides() {
		console.log('getRides is running.');	
	  
      if (vm.currentUser && vm.currentUser.route) { //make sure we're logged in and location is set
        selfRegistrationLoopBackApi
		.getRides(vm.currentUser)
          .then(function (ridesData) {			  
            vm.ridesData = ridesData.rides; //populate the variable with the ride data
			console.log('rides gotten');
		  });
      }
	  
    }
	
  }
angular.module('ngMap').run(function($rootScope, NgMap) {
  NgMap.getMap().then(function(map) {
    $rootScope.map = map;
  });
});  
})();
