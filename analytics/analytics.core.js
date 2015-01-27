var init = function() {

    var analyticsModule = angular.module('analyticsModule', []);

    analyticsModule.directive('amGrid', function() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                source: '=',
                autoGenerateColumns: '='
            },
            templateUrl: 'analytics/templates/grid.html',
            link: function(scope, element, attrs) {

            },
            controller: function($scope) {
                $scope.columns = [];
                $scope.sortkey = 'album';
                this.addColumn = function(scope) {
                    $scope.columns.push(scope);
                }
                this.sort = function(val,reverse) {
                    $scope.sortkey = val;
                    $scope.reverse = reverse;
                }
                this.search = function(key,val){
                  $scope.searchkey = key;
                  $scope.searchval = val;
                }
            }
        }
    });
    analyticsModule.directive('column', function() {
        return {
            restrict: 'E',
            replace: true,
            require: '^amGrid',
            scope: {
                title: '@',
                key: '@',
                liwidth: '@',
                dataType: '@'
            },
            templateUrl: 'analytics/templates/column.html',
            link: function(scope, element, attrs, gridCtrl) {
                gridCtrl.addColumn(scope);
                if ('sortable' in attrs)
                    scope.sortable = true;
                if ('resizable' in attrs)
                    scope.resizable = true;
                if ('filter' in attrs)
                    scope.filter = true;
                if ('searcheable' in attrs)
                    scope.searcheable = true;
                scope.sort = function(val) {
                    scope.reverse = !scope.reverse;
                    gridCtrl.sort(val, scope.reverse);
                }
                scope.$watch("searchval",function(newval, oldval){
                  gridCtrl.search(scope.key,newval);
                })
                //gridCtrl.scope.searchkey = scope.searchkey;
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', init);