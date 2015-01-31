var initFilters = function() {

    var analyticsModule = angular.module('analyticsModule');

    analyticsModule.filter('orderObjectBy', function() {
        return function(items, field, dir) {
            if (!dir)
                return items;
            var filtered = items.slice(0);

            if (isNaN(items[0][field]))
                filtered.sort(function(a, b) {
                    return (a[field] > b[field] ? 1 : -1);
                });
            else
                filtered.sort(function(a, b) {
                    return a[field] - b[field];
                });

            if (dir == 'desc') filtered.reverse();
            return filtered;
        };
    });
    analyticsModule.filter('filterObjectBy', function() {
        return function(items, searchfield, val) {
            var filtered = [];
            if (!searchfield)
                return items;
            if (val) {
                angular.forEach(items, function(item) {
                    if ((item[searchfield]).toLowerCase().indexOf(val) > -1)
                        filtered.push(item);
                });
            } else {
                var filtered = items.slice(0);
                angular.forEach(searchfield, function(field) {
                    if (!field.searchval)
                        return;
                    if (filtered.length) {
                        filteredItems = filtered;
                        filtered = [];
                    }

                    angular.forEach(filteredItems, function(item) {
                        if (item[field.name].toLowerCase().indexOf(field.searchval) > -1)
                            filtered.push(item);
                    });
                });
            }
            return filtered;
        };
    });
}

document.addEventListener('DOMContentLoaded', initFilters);