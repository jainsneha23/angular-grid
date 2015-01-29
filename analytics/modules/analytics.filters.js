var initFilters = function(){

    var analyticsModule = angular.module('analyticsModule');

    analyticsModule.filter('orderObjectBy', function() {
        return function(items, field, reverse) {
            var filtered = [];
            angular.forEach(items, function(item) {
                filtered.push(item);
            });
            filtered.sort(function(a, b) {
                return (a[field] > b[field] ? 1 : -1);
            });
            if (reverse) filtered.reverse();
            return filtered;
        };
    });
    analyticsModule.filter('filterObjectBy', function() {
        return function(items, field, val) {
            var filtered = [];
            if (!val)
                return items;
            angular.forEach(items, function(item) {
                if ((item[field]).toLowerCase().indexOf(val) > -1)
                    filtered.push(item);
            });
            return filtered;
        };
    });
}

document.addEventListener('DOMContentLoaded', initFilters);