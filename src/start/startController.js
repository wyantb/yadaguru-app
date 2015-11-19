define(['app'], function(app) {

  var StartController = function($scope) {
    $scope.step = 1;

    $scope.nextStep = function() {
      $scope.step++;
    };

    $scope.prevStep = function() {
      $scope.step--;
    };

    $scope.format = 'M/d/yyyy';
    $scope.today = function() {
      $scope.dt = new Date();
    };
    $scope.today();

    $scope.clear = function() {
      $scope.dt = null;
    };

    $scope.open = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.opened = true;
    };

    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };

    $scope.minDate = new Date();
  };

  app.register.controller('StartController', ['$scope', StartController]);
});
