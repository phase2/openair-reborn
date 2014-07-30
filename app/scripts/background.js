'use strict';

chrome.runtime.onInstalled.addListener(function (details) {
    console.log('previousVersion', details.previousVersion);
});

chrome.browserAction.onClicked.addListener(function() {
    chrome.storage.sync.get('timesheetUrl', function (obj) {
        var url;
        if (obj.timesheetUrl) {
            url = obj.timesheetUrl;
        } else {
            url = 'http://openair.com/index.pl';
        }
        chrome.tabs.query({url: 'https://www.openair.com/timesheet.pl?uid=*'}, function (tabs) {
            if (tabs.length > 0) {
                chrome.tabs.update(tabs[0].id, {selected: true});
            } else {
                chrome.tabs.create({url: url});
            }
        });
    });


});