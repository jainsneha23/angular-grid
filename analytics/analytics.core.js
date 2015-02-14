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
            controller: function($scope) {

            },
            link: function($scope, element, attrs) {

                var createColumns = function() {
                    $scope.origColumnData = [];
                    angular.forEach($scope.uiGrid.data[0], function(item, index) {
                        if (typeof item == 'object') {
                            angular.forEach(item, function(subitem, subindex) {
                                $scope.origColumnData.push({
                                    name: index + "." + subindex,
                                    active: true
                                });
                            });
                        } else {
                            $scope.origColumnData.push({
                                name: index,
                                active: true
                            });
                        }
                    });
                    if ($scope.uiGrid.columnDefs) {
                        $scope.origColumnData = $scope.origColumnData.map(function(item) {

                            var pos = $scope.uiGrid.columnDefs.map(function(e) { return e.name; }).indexOf(item.name);
                            
                            if (pos > -1) {
                                $scope.uiGrid.columnDefs[pos].active = true;
                                return $scope.uiGrid.columnDefs[pos];
                            } else {
                                item.active = false;
                                return item;
                            }
                        });
                    }
                };

                var createGrid = function() {
                    $scope.columnData = [];

                    $scope.origColumnData.forEach(function(item) {
                        if(item.active == true)
                            $scope.columnData.push(Object.create(item));
                    });

                    $scope.gridData = [];
                    angular.forEach($scope.uiGrid.data, function(item, index) {
                        var row = {};
                        angular.forEach($scope.columnData, function(prop, i) {
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
                        $scope.gridData.push(row);
                        $scope.origGridData = $scope.gridData.slice();
                    });
                };

                var paging = function() {
                    if (!$scope.uiGrid.maxRow) return;
                    $scope.pageSize = $scope.uiGrid.maxRow || $scope.gridData.length;
                    if ($scope.pageSize >= $scope.gridData.length) {
                        $scope.noOfPages = 1;
                    } else {
                        $scope.noOfPages = parseInt($scope.gridData.length / $scope.pageSize);
                    }
                    $scope.currPage = 1;
                };

                var init = function() {
                    createColumns();
                    createGrid();
                    paging();
                }();

                $scope.$watch('columnData', function(newval, oldval) {
                    //change in columns
                    if(newval && newval.length != oldval.length)
                      return;
                    angular.forEach(oldval, function(item, i) {
                        var changed = false;
                        var oldSearch = oldval[i].searchval || '';
                        var newSearch = newval[i].searchval || '';
                        if (oldSearch.length < newSearch.length) {
                            $scope.gridData = $filter('filterObjectBy')($scope.gridData, newval[i].name, newval[i].searchval);
                            changed = true;
                        } else if (oldSearch.length > newSearch.length) {
                            $scope.gridData = $filter('filterObjectBy')($scope.origData, newval);
                            changed = true;
                        }
                        if (oldval[i].dir != newval[i].dir || changed) {
                            $scope.gridData = $filter('orderObjectBy')($scope.gridData, $scope.sortItem, $scope.dir);
                            if (changed)
                                paging();
                        }
                    });
                }, true);

                $scope.$watch('origColumnData', function(newval, oldval) {
                          createGrid();
                }, true);

                $scope.setSort = function(sortItem, dir) {
                    sortItem = sortItem || 'hashIndex';
                    dir = dir || 'asc';
                    $scope.sortItem = sortItem;
                    $scope.dir = dir;
                    angular.forEach($scope.columnData, function(obj) {
                        if (obj.name == sortItem)
                            obj.dir = dir;
                        else if (obj.sortable)
                            obj.dir = "";
                    });
                }
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', init);