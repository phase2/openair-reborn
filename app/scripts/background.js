'use strict';

chrome.runtime.onInstalled.addListener(function (details) {
    console.log('previousVersion', details.previousVersion);
});

//chrome.browserAction.setBadgeText({text: '\'Allo'});

chrome.browserAction.onClicked.addListener(function(activeTab) {
    chrome.storage.sync.get('timesheetUrl', function (obj) {
        if (obj.timesheetUrl) {
            var url = obj.timesheetUrl;
        } else {
            var url = 'http://openair.com/index.pl';
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

//console.log('\'Allo \'Allo! Event Page for Browser Action');
