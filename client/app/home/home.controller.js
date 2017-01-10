(function () {
  'use strict';

  var selfRegistrationLoopBack = angular.module('selfRegistrationLoopBack');

  selfRegistrationLoopBack.controller('HomeCtrl', HomeCtrl);

  selfRegistrationLoopBack.$inject =
    ['appSpinner', 'selfRegistrationLoopBackApi', '$q', '$rootScope', '$state'];

  function HomeCtrl($rootScope, $state, selfRegistrationLoopBackApi) {

    var vm = this;

    vm.currentUser = $rootScope.currentUser; //define the session

    vm.getRides = getRides; 

    vm.ridesData = null;

    vm.getRides();
	
	vm.saveRoute = saveRoute;
	
    if ($rootScope.currentUser == null) { //Show signup page if no session
      $state.go('signup');
    }

    function saveRoute() {
        if (vm.currentUser.route.start_address  &&
            vm.currentUser.route.start_address  !== ""  &&
            vm.currentUser.route.end_address  &&
            vm.currentUser.route.end_address  !== "" ) {

          selfRegistrationLoopBackApi
            .saveRoute(vm.currentUser)
            .then(function(){
               console.log("Route saved!");
			   $state.go('home');

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
