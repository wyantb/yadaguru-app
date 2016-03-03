define(['app'], function(app) {

  'use strict';

  var apiService = function($http, constants) {

    var yadaAPI = {};

    yadaAPI.reminders = {};
    var apiRoute = constants.HOSTNAME + constants.API_ROUTE;
    var apiRouteTerminator = constants.API_ROUTE_TERMINATOR;

    yadaAPI.login = function(data) {
      return $http.post(apiRoute + 'users/login/', data);
    };

    yadaAPI.logout = function(data) {
      return $http.post(apiRoute + 'users/logout/', data);
    };

    yadaAPI.currentUser = function() {
      return $http.get(apiRoute + 'users/currentUser');
    };

    yadaAPI.reminders.get = function(user_id) {
      return $http.get(apiRoute + 'reminders/?u=' + user_id);
    };

    yadaAPI.reminders.post = function(data, user_id) {
      return $http.post(apiRoute + 'reminders/?u=' + user_id, data);
    };

    yadaAPI.reminders.put = function(id, data, user_id) {
      return $http.put(apiRoute + 'reminders/' + id + '/?u=' + user_id, data);
    };

    yadaAPI.reminders.delete = function(id, user_id) {
      return $http.delete(apiRoute + 'reminders/' + id + '/?u=' + user_id);
    };
    
    yadaAPI.users = {};

    yadaAPI.users.post = function() {
      return $http.post(apiRoute + 'users/', null);
    };

    yadaAPI.users.put = function(id, data) {
      return $http.put(apiRoute + 'users/' + id, data);
    };

    yadaAPI.users.delete = function(id) {
      return $http.delete(apiRoute + 'users/' + id);
    };

    yadaAPI.sms = {};

    yadaAPI.sms.confirmSmsNumber = function(data) {
      return $http.post(apiRoute + 'sms/', data)
    };

    yadaAPI.schools = {};

    yadaAPI.schools.get = function(user_id) {
      return $http.get(apiRoute + 'schools/?u=' + user_id);
    };

    yadaAPI.schools.post = function(data, user_id) {
      return $http.post(apiRoute + 'schools/?u=' + user_id, data);
    };

    yadaAPI.schools.put = function(id, data, user_id) {
      return $http.put(apiRoute + 'schools/' + id + '/?u=' + user_id, data);
    };

    yadaAPI.schools.delete = function(id, user_id) {
      return $http.delete(apiRoute + 'schools/' + id + '/?u=' + user_id);
    };

    yadaAPI.categories = {};

    yadaAPI.categories.get = function() {
      return $http.get(apiRoute + 'categories' + apiRouteTerminator);
    };

    yadaAPI.categories.post = function(data) {
      return $http.post(apiRoute + 'categories/', data);
    };

    yadaAPI.categories.put = function(id, data) {
      return $http.put(apiRoute + 'categories/' + id, data);
    };

    yadaAPI.categories.delete = function(id) {
      return $http.delete(apiRoute + 'categories/' + id);
    };

    yadaAPI.testDates = {};

    yadaAPI.testDates.get = function() {
      return $http.get(apiRoute + 'test-dates' + apiRouteTerminator);
    };

    yadaAPI.testDates.post = function(data) {
      return $http.post(apiRoute + 'test-dates/', data);
    };

    yadaAPI.testDates.put = function(id, data) {
      return $http.put(apiRoute + 'test-dates/' + id, data);
    };

    yadaAPI.testDates.delete = function(id) {
      return $http.delete(apiRoute + 'test-dates/' + id);
    };

    yadaAPI.testMessages = {};

    yadaAPI.testMessages.get = function() {
      return $http.get(apiRoute + 'test-messages' + apiRouteTerminator);
    };

    yadaAPI.testMessages.put = function(id, data) {
      return $http.put(apiRoute + 'test-messages/' + id, data);
    };

    yadaAPI.faqs = {};

    yadaAPI.faqs.get = function() {
      return $http.get(apiRoute + 'faqs' + apiRouteTerminator);
    };

    yadaAPI.faqs.put = function(id, data) {
      return $http.put(apiRoute + 'faqs/' + id, data);
    };

    yadaAPI.settings = {};

    yadaAPI.settings.get = function() {
      return $http.get(apiRoute + 'settings' + apiRouteTerminator);
    };

    yadaAPI.settings.put = function(id, data) {
      return $http.put(apiRoute + 'settings/' + id, data);
    };

    return yadaAPI;
  };

  app.factory('yg.services.api', ['$http', 'constants', apiService]);

});
