'use strict';
/*global $:false */
/*global angular:false */
/*exported app*/

var app = angular.module('OpenAirReborn',['localytics.directives', 'timer']);

function addInitialMarkup() {
    // Build the wrapper divs
    var $content = $('<div id="p2_content" ng-app="OpenAirReborn" ng-csp></div>');
    var $app = $('<div ng-controller="TimeEntryController" class="oa_reborn_wrapper"></div>');

    // Build the partials
    var url = chrome.extension.getURL('views/form.html');
    $app.append('<div ng-include src="\'' + url + '\'"></div>');
    url = chrome.extension.getURL('views/table.html');
    $app.append('<div ng-include src="\'' + url + '\'"></div>');

    $content.append($app); // Finalize our custom markup string.
    $('body').append($content); // Add our custom markup to the page itself.
}

if ($('body').hasClass('timesheet')) {
    addInitialMarkup();
}
