document.addEventListener('DOMContentLoaded',function(){
  angular.bootstrap(document, ['myapp']);
});

var myapp = angular.module('myapp', ['analyticsModule']);

myapp.controller('appcontroller', function($scope) {
    
    $scope.list = list;
});