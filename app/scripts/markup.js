'use strict';
/*global $:false */
/*global angular:false */
/*exported app*/

var app = angular.module('OpenAirReborn',['localytics.directives']);

function addInitialMarkup() {
    var $timesheet = $('#timesheet_grid');
    if ($timesheet.length < 1) {
        return;
    }

    var $content = $('<div id="p2_content" ng-app="OpenAirReborn" ng-csp></div>');
    var $app = $('<div ng-controller="TimeEntryController" class="oa_reborn_wrapper"></div>');

    // Add the partials
    var url = chrome.extension.getURL('views/form.html');
    $app.append('<div ng-include src="\'' + url + '\'"></div>');
    url = chrome.extension.getURL('views/table.html');
    $app.append('<div ng-include src="\'' + url + '\'"></div>');

    $content.append($app);
    $timesheet.after($content);
}

/**
 * @TODO: Convert to Angular magic instead of jQuery dookie.
 */
function addPreviewButton() {
    $('#timesheet_savebutton').insertBefore('#save_grid_submit');
    $('<button id="p2_preview" class="btn-oa">Preview</button>').insertAfter('#timesheet_savebutton');

    $('#p2_preview').click(function (e) {
        e.preventDefault();
        $('#p2_sidebar, #p2_content, #timesheet_grid, .timesheetPinned').toggle();
        if ($(this).text() === 'Preview') {
            $(this).html('Edit');
        } else {
            $(this).html('Preview');
        }
    });
}

addInitialMarkup();
addPreviewButton();