var init = function() {

    Analytics = window.Analytics || {};

    var analyticsModule = angular.module('analyticsModule',[]);

    analyticsModule.directive('uiGrid', function($filter,$timeout) {
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
                $scope.local = {};
                $scope.local.gridReady = false;
                $scope.dWidth = 150;

                $scope.styling = function() {
                    if ($scope.uiGrid.height) {
                        var height = parseInt($scope.uiGrid.height);
                        document.getElementById('agridTable').style.maxHeight = height + 'px';
                        document.getElementById('agridTable').style.overflow = 'auto';
                    }
                    $scope.local.gridReady = true;
                }

                var createColumns = function() {
                    $scope.local.origColumnData = [];
                    angular.forEach($scope.uiGrid.data[0], function(item, index) {
                        if (typeof item == 'object') {
                            angular.forEach(item, function(subitem, subindex) {
                                $scope.local.origColumnData.push({
                                    name: index + "." + subindex,
                                    active: true
                                });
                            });
                        } else {
                            $scope.local.origColumnData.push({
                                name: index,
                                active: true
                            });
                        }
                    });
                    if ($scope.uiGrid.columnDefs) {
                        $scope.local.origColumnData = $scope.local.origColumnData.map(function(item) {

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
                    $scope.local.gridReady = false;
                    $scope.local.columnData = [];
                    var flexCol = 0, contentWidth = 0;

                    $scope.local.origColumnData.forEach(function(item) {
                        if(item.active == true){
                            $scope.local.columnData.push(item.clone());
                            if(!item.width){
                                flexCol++;
                                contentWidth += 150;
                            }
                            else contentWidth += item.width;
                        }
                    });
                    
                    var width = document.getElementById('agrid').offsetWidth;
                    if(contentWidth < width)
                        $scope.dWidth = 150 + (width - contentWidth - 20)/flexCol;
                    
                    $scope.local.gridData = [];
                    angular.forEach($scope.uiGrid.data, function(item, index) {
                        var row = {};
                        angular.forEach($scope.local.columnData, function(prop, i) {
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
                        $scope.local.gridData.push(row);
                    });
                    $scope.local.origGridData = $scope.local.gridData.slice(0)
                };

                var resetPageSize = function(){
                  $scope.local.pageSize = Math.min($scope.uiGrid.pageSize,$scope.local.gridData.length);
                }

                var paging = function() {
                    $scope.local.currPage = 1;
                    if (!$scope.uiGrid.pageSize) return;
                    if ($scope.local.pageSize >= $scope.local.gridData.length) {
                        $scope.local.noOfPages = 1;
                    } else {
                        $scope.local.noOfPages = Math.ceil($scope.local.gridData.length / $scope.local.pageSize);
                    }
                    
                };

                $scope.pageChanged = function(){
                  if(isNaN($scope.local.pageSize) || $scope.local.pageSize < 1 || $scope.local.pageSize > $scope.local.gridData.length){
                        alert('Please enter a valid rows per page');
                        resetPageSize();
                        return;
                  }
                  paging();
                }

                var init = function() {
                    createColumns();
                    createGrid();
                    resetPageSize();
                    paging();
                }();

                $scope.$watch('local.columnData', function(newval, oldval) {
                    //change in columns
                    if(newval && newval.length != oldval.length)
                      return;
                    angular.forEach(oldval, function(item, i) {
                        var changed = false;
                        var oldSearch = oldval[i].searchval || '';
                        var newSearch = newval[i].searchval || '';
                        if (oldSearch.length < newSearch.length) {
                            $scope.local.gridData = $filter('filterObjectBy')($scope.local.gridData, newval[i].name, newval[i].searchval);
                            changed = true;
                        } else if (oldSearch.length > newSearch.length) {
                            $scope.local.gridData = $filter('filterObjectBy')($scope.local.origGridData, newval);
                            changed = true;
                        }
                        if (oldval[i].dir != newval[i].dir || changed) {
                            $scope.local.gridData = $filter('orderObjectBy')($scope.local.gridData, $scope.local.sortItem, $scope.local.dir);
                            if (changed)
                                paging();
                        }
                    });
                }, true);

                $scope.$watch('local.origColumnData', function(newval, oldval) {
                          createGrid();
                }, true);

                $scope.setSort = function(sortItem, dir) {
                    sortItem = sortItem || 'hashIndex';
                    dir = dir || 'asc';
                    $scope.local.sortItem = sortItem;
                    $scope.local.dir = dir;
                    angular.forEach($scope.local.columnData, function(obj) {
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
