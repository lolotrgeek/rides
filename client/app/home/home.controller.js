(function () {
  'use strict';

  var selfRegistrationLoopBack = angular.module('selfRegistrationLoopBack');

  selfRegistrationLoopBack.controller('HomeCtrl', HomeCtrl);

  selfRegistrationLoopBack.$inject =
    ['appSpinner', 'selfRegistrationLoopBackApi', '$q', '$rootScope', '$state'];

  function HomeCtrl($rootScope, $state, selfRegistrationLoopBackApi) {

    var vm = this;

    vm.currentUser = $rootScope.currentUser;

    vm.getRides = getRides;

    vm.ridesData = null;

    vm.getRides();

    if ($rootScope.currentUser == null) {
      $state.go('signup');
    }

    function getRides() {

      if (vm.currentUser && vm.currentUser.preferences) {
        selfRegistrationLoopBackApi
          .getRides(vm.currentUser)
          .then(function (ridesData) {
            vm.ridesData = ridesData.rides[0];
          });
      }
    }




  }
})();
