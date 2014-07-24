'use strict';

/*global angular:false */

var app = angular.module('OpenAirRebornOptions',['localytics.directives']);

app.controller('OptionsController', ['$scope', function($scope) {

    /**
     * Save the values in the options page to Chrome's synced storage.
     */
    $scope.save = function() {
        chrome.storage.sync.set({
            dayTimeFormat : $scope.dayTimeFormat,
            multipleTimers : $scope.multipleTimers,
            persistentTimers : $scope.persistentTimers,
            enableTimers : $scope.enableTimers
        }, function() {
            $scope.status = "Settings saved successfully.";
            $scope.$apply();
        });
    };

    /**
     * Perform a save but also close the tab.
     */
    $scope.saveAndClose = function() {
        $scope.save();
        chrome.tabs.getCurrent(function(tab) {
            chrome.tabs.remove(tab.id, function() { });
        });
    };

    /**
     * Clear out all of the saved settings and reset to defaults.
     */
    $scope.reset = function() {
        chrome.storage.sync.clear();
        $scope.initialize();
    };

    /**
     * Attempt to load a saved setting, and if it doesn't exist, then just
     * initialize it from the passed in default value instead.
     *
     * @param {string} optionName
     * @param {mixed} defaultVal
     */
    $scope.load = function(optionName, defaultVal) {
        var exists = false;
        chrome.storage.sync.get(optionName, function (obj) {
            if (obj[optionName]) {
                exists = true;
                $scope[optionName] = obj[optionName];
                $scope.$apply();
            }
        });
        if (!exists) {
            $scope[optionName] = defaultVal;
        }
    };

    /**
     * Set up starter values for each of the fields in our form.
     */
    $scope.initialize = function() {
        $scope.load('dayTimeFormat', 'hhmm');
        $scope.load('multipleTimers', 1);
        $scope.load('persistentTimers', 1);
        $scope.load('enableTimers', 1);
    };

    // And away we go...
    $scope.initialize();
}]);
