(function () {
  'use strict';

  var selfRegistrationLoopBack = angular.module('selfRegistrationLoopBack');

  selfRegistrationLoopBack.controller('PreferencesCtrl', PreferencesCtrl);

  selfRegistrationLoopBack.$inject =
    ['appSpinner', 'selfRegistrationLoopBackApi', '$q', '$rootScope', '$state'];


  function PreferencesCtrl($rootScope, selfRegistrationLoopBackApi, $state) {
    var vm = this;

    vm.savePreferences = savePreferences;
    vm.currentUser =  $rootScope.currentUser;

    function savePreferences() {
        if (vm.currentUser.preferences.start_address  &&
            vm.currentUser.preferences.start_address  !== ""  &&
            vm.currentUser.preferences.end_address  &&
            vm.currentUser.preferences.end_address  !== "" ) {

          selfRegistrationLoopBackApi
            .savePreferences(vm.currentUser)
            .then(function(){
               console.log("Preferences saved!");
               $state.go('home');

            });
        }
    }


  }
})();
