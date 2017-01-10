(function () {
  'use strict';

  angular.module('selfRegistrationLoopBack')
    .factory('selfRegistrationLoopBackApi', selfRegistrationLoopBackApi)
    .factory('AuthService', AuthService);


  selfRegistrationLoopBackApi.$inject = ['Subscriber', 'appSpinner', '$q', '$rootScope'];

  function selfRegistrationLoopBackApi(Subscriber, appSpinner) {

    var service = {
      retrieveCurrentUser: retrieveCurrentUser,
      getRides: getRides,
	  saveRoute: saveRoute,
      savePreferences: savePreferences

    };


    return service;

    function retrieveCurrentUser(userId) {

      return Subscriber
          .findById(
          {
              id: userId
          });
    }

    function getRides(subscriber) {

      return Subscriber
        .getRides(
             {
               id: subscriber.id
             }
        )
        .$promise;
    }

    function saveRoute(subscriber) {
      return Subscriber
             .upsert(subscriber)
             .$promise;

    }	
	
    function savePreferences(subscriber) {
      return Subscriber
             .upsert(subscriber)
             .$promise;

    }


  }

  function AuthService(Subscriber, $q, $rootScope) {

    function login(email, password) {
      return Subscriber
        .login({email: email, password: password})
        .$promise
        .then(function (response) {
          $rootScope.currentUser = {
            id: response.user.id,
            tokenId: response.id,
            username: response.user.username,
            email: email,
			route: response.user.route, //remove, dont want to remember old routes
            preferences: response.user.preferences || null
          };
        });
    }

    function logout() {
      return Subscriber
        .logout()
        .$promise
        .then(function () {
          $rootScope.currentUser = null;
        });
    }

    function register(username, email, password) {
      return Subscriber
        .create({
          username: username,
          email: email,
          password: password
        })
        .$promise
        .then(function (response) {
           return login(email, password);
        });;
    }

    return {
      login: login,
      logout: logout,
      register: register
    };

  }
})();
