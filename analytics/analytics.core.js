var init = function() {

    var analyticsModule = angular.module('analyticsModule', []);

    analyticsModule.directive('uiGrid', function($filter) {
        return {
            restrict: 'A',
            transclude: true,
            scope: {
                uiGrid: '='
            },
            templateUrl: 'analytics/templates/grid.html',
            link: function(scope, element, attrs) {

                scope.columnData = scope.uiGrid.columnDefs;
                scope.sortItem = '';
                scope.dir = '';

                var createGrid = function() {
                    scope.gridData = [];
                    angular.forEach(scope.uiGrid.data, function(item, index) {
                        var row = {};
                        angular.forEach(scope.columnData, function(prop,i) {
                            row.hashIndex = index;
                            if (prop.name.indexOf('.') == -1) {
                                if (item[prop.name] && typeof item[prop.name] != "string")
                                    row[prop.name] = item[prop.name].toString();
                                else
                                    row[prop.name] = item[prop.name];
                            } else {
                                var subprop = prop.name.split('.');
                                var member = item;
                                subprop.forEach(function(key) {
                                    member = member[key];
                                });
                                if (member && typeof member != "string")
                                    row[prop.name] = member.toString();
                                else
                                    row[prop.name] = member;
                            }
                        });
                        scope.gridData.push(row);
                        scope.origData = scope.gridData.slice();
                    });
                }();
                scope.$watch('columnData', function(newval, oldval) {
                    angular.forEach(oldval, function(item, i) {
                        var oldSearch = oldval[i].searchval || '';
                        var newSearch = newval[i].searchval || '';
                        if (oldSearch.length < newSearch.length)
                            scope.gridData = $filter('filterObjectBy')(scope.gridData, newval[i].name, newval[i].searchval);
                        else if (oldSearch.length > newSearch.length)
                            scope.gridData = $filter('filterObjectBy')(scope.origData, newval);
                        //else if(oldval[i].dir != newval[i].dir)
                        scope.gridData = $filter('orderObjectBy')(scope.gridData, scope.sortItem, scope.dir );
                    });
                }, true);
                scope.setSort = function(sortItem, dir) {
                    sortItem = sortItem || 'hashIndex';
                    dir = dir || 'asc';
                    scope.sortItem = sortItem;
                    scope.dir = dir;
                    angular.forEach(scope.columnData,function(obj){
                        if(obj.name == sortItem)
                            obj.dir = dir;
                        else if(obj.sortable)
                            obj.dir = "";
                    });
                }

            },
            controller: function($scope) {}
        }
    });
}

document.addEventListener('DOMContentLoaded', init);