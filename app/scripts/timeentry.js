'use strict';

var app = angular.module('OpenAirReborn',[]);

app.controller('timeEntryController', ['$scope', function($scope) {

    $scope.projects = {};

    $scope.tasks = {};

    $('.timesheetControlPopupCustomerProject').first().find('option').each(function () {
        if ($(this).text().length > 0) {
            $scope.projects[$(this).val()] = $(this).text();
        }
    });
}]);