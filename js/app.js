document.addEventListener('DOMContentLoaded', function() {
    angular.bootstrap(document, ['myapp']);
});

var myapp = angular.module('myapp', ['analyticsModule']);

myapp.controller('appcontroller', function($scope) {

    $scope.list = list;
    $scope.gridOptions = {};
    $scope.gridOptions.data = list;
    $scope.gridOptions.enableColumnResizing = true;
    $scope.gridOptions.enableRowSelection = true;
    $scope.gridOptions.maxRow = 10;

    $scope.gridOptions.rowIdentity = function(row) {
        return row.id;
    };
    $scope.gridOptions.getRowIdentity = function(row) {
        return row.id;
    };

    $scope.gridOptions.columnDefs = [{
        name: 'id',
        width: 50,
        sortable: true
    }, {
        name: 'name',
        width: 100,
        searcheable : true
    }, {
        name: 'age',
        width: 100,
        enableCellEdit: true,
        searcheable : false,
        //aggregationType: uiGridConstants.aggregationTypes.avg,
        cellTemplate: '<div class="ui-grid-cell-contents"><span>Age:{{COL_FIELD}}</span></div>'
    }, {
        name: 'address.street',
        width: 150,
        enableCellEdit: true,
        cellTemplate: '<div class="ui-grid-cell-contents"><span>Street:{{COL_FIELD}}</span></div>'
    }, {
        name: 'address.city',
        width: 150,
        enableCellEdit: true,
        searcheable : true,
        cellTemplate: '<div class="ui-grid-cell-contents"><span>City:{{COL_FIELD}}</span></div>'
    }, {
        name: 'address.state',
        width: 50,
        enableCellEdit: true,
        sortable : true,
        cellTemplate: '<div class="ui-grid-cell-contents"><span>State:{{COL_FIELD}}</span></div>'
    }, {
        name: 'address.zip',
        width: 50,
        enableCellEdit: true,
        cellTemplate: '<div class="ui-grid-cell-contents"><span>Zip:{{COL_FIELD}}</span></div>'
    }, {
        name: 'company',
        width: 100,
        enableCellEdit: true,
        cellTemplate: '<div class="ui-grid-cell-contents"><span>Company:{{COL_FIELD}}</span></div>'
    }, {
        name: 'email',
        width: 100,
        enableCellEdit: true,
        cellTemplate: '<div class="ui-grid-cell-contents"><span>Email:{{COL_FIELD}}</span></div>'
    }, {
        name: 'phone',
        width: 200,
        enableCellEdit: true,
        cellTemplate: '<div class="ui-grid-cell-contents"><span>Phone:{{COL_FIELD}}</span></div>'
    }, {
        name: 'about',
        width: 300,
        enableCellEdit: true,
        cellTemplate: '<div class="ui-grid-cell-contents"><span>AAbout:{{COL_FIELD}}</span></div>'
    }];
});