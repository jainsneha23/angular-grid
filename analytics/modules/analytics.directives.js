var initDirectives = function() {

    var analyticsModule = angular.module('analyticsModule');

    analyticsModule.directive('dropdown', function($document){
        return {
            restrict: "EA",
            transclude: true,
            scope: {
                dropdownPlaceholder : '@'
            },
            template: 
               "<div class='dropdown'><div ng-click='show = !show' class='dropdown-selector' ng-class='{glow: show}'> \
                        <span ng-class='{grayed: !dropdownModel}'>{{dropdownPlaceholder}}</span> \
                        <div class='arrow-down'></div>\
                    </div> \
                <div ng-show='show' class='dropdown-wrapper'> \
                    <ul class='box' ng-transclude></ul> \
                </div></div>",
            controller: function($scope){
                $scope.show = false;
                this.setModel = function(value){
                    $scope.dropdownModel = value;
                    $scope.dropdownPlaceholder = value;
                    $scope.show = false;
                    $scope.searchText = '';
                };
            },
            link: function(scope, element, attrs){
                element.bind('click', function(e){
                    e.stopPropagation();
                });

                scope.$watch('searchText', function(text){
                    if (text !== undefined){
                        angular.forEach(element.find('dropdown-group'), function(value){
                            var is_group = true;
                            angular.forEach(angular.element(value).find('dropdown-item'), function(item){
                                itemSpan = angular.element(item).find('span')[0]; 
                                itemHtml = itemSpan.innerHTML;
                                itemHtml = itemHtml.replace('<b>','').replace('</b>','');
                                var i = itemHtml.toLowerCase().indexOf(text.toLowerCase());
                                if (text !== '' && i === -1){
                                    item.hidden = true;
                                } else {
                                    item.hidden = false;
                                    itemSpan.innerHTML = itemHtml.substring(0,i) + "<b>" + itemHtml.substring(i,i+text.length)+ "</b>" + itemHtml.substring(i+text.length);
                                    is_group = false;
                                }
                            });
                            value.hidden = is_group;
                        }); 
                    }
                });

                $document.bind('click', function(event){
                    scope.show = false;
                    scope.$apply();
                });
            }
        };
    });
    analyticsModule.directive('search', function(){
       return {
            restrict: 'EA',
            scope: {
                placeholder: '@',
                searchModel: '='
            },
            template: 
            '<div class="search">'+
            '   <div class="left">'+
            '       <div class="search-icon"></div>'+
            '   </div>'+
            '   <div class="right">'+
            '       <input class="search-input" type="text" ng-model="searchModel" placeholder="{{placeholder}}">'+
            '   </div>'+
            '   <div style="clear:both;"></div>'+
            '</div>',
        };
    });
    analyticsModule.directive('multiSelect', function(){
       return {
            restrict: 'EA',
            scope: {
                ngModel: '=',
                searchModel: '='
            },
            replace: true,
            template: '<ul>\
                    <div ng-show="!searchModel"><input type="checkbox" ng-click = "toggleSelectAll()" ng-checked="selectAll">\
                    <span>Check All</span></div>\
                    <li ng-repeat="obj in ngModel|filter:searchModel">\
                        <input type="checkbox" ng-model="obj.active" ng-change="updateSelectAll()">\
                        <span>{{obj.name}}</span>\
                    </li>\
                </ul>',
            link : function($scope, element, attrs){
                var changeObj = function(elm, key, val) {
                    elm.map(function(obj) {
                        obj[key] = val;
                    });
                };
                var checkObj = function(elm, key, val) {
                    if (elm && elm.length > 0)
                        var res = elm.every(function(obj) {
                            return obj[key] == val;
                        });
                    return res;
                };

                $scope.toggleSelectAll = function() {
                    $scope.selectAll = !$scope.selectAll;
                    if ($scope.selectAll)
                        changeObj($scope.ngModel, "active", true);
                    else
                        changeObj($scope.ngModel, "active", false);
                };
                
                $scope.updateSelectAll = function() {
                    if (checkObj($scope.ngModel, "active", true))
                        $scope.selectAll = true;
                    else
                        $scope.selectAll = false;
                };
            }
        };
    });
}

document.addEventListener('DOMContentLoaded', initDirectives);