'use strict';

/*global angular:false */
/*global app:false */
/*global alert:false */
/*global confirm:false */

/**
 * @file An Angular controller used for managing the custom UI for OpenAir.
 */

app.controller('TimeEntryController', ['$scope', 'OpenAirService', function($scope, OpenAirService) {

    /**
     * Adds time to the list of time entries.
     */
    $scope.addTime = function(e) {
        e.preventDefault();

        if (!$scope.notes || !$scope.project || !$scope.task) {
            // Don't submit time if there are some empty fields.
            alert('Please fill out all fields before submitting the form.');
            return;
        }

        if ($scope.when === "" || typeof $scope.when === "undefined" || $scope.when.length === 0) {
            // If the "Day" field is empty, we just use the current day.
            $scope.when = [$scope.getDay()];
        }

        // Need a forEach because adding time to multiple days at once is supported.
        angular.forEach($scope.when, function(day) {
            var timeEntry = {
                time: $scope.time,
                project: $scope.project,
                projectName: OpenAirService.fetchProjects()[$scope.project],
                task: $scope.task,
                taskName: OpenAirService.fetchTasks($scope.project)[$scope.task],
                notes: $scope.notes,
                day: day,
                timerStart: 0
            };

            if (timeEntry.time) {
                // If the "time" field has a value, then we are NOT starting
                // a timer right now, so just set the entry's "timerStart" to be
                // the number of milliseconds in the entry, so that if/when we
                // do start a timer, we will be ready for it.
                timeEntry.timerStart = timeEntry.time * 60 * 60 * 1000;
            } else {
                // Or, if the "time" field is empty, then we ARE starting a timer
                // right now, so go ahead and set that up.
                timeEntry.timing = true;
                timeEntry.timerStarted = true;
            }

            if (!$scope.timeEntries[day]) {
                // This is the first time entry for this day, so create the container.
                $scope.timeEntries[day] = [];
            }

            // Add the time to the OA time grid, and grab the cell's ID so
            // that we have it for later editing, deletion, etc.
            timeEntry.id = OpenAirService.addTime(timeEntry);
            $scope.timeEntries[day].push(timeEntry);

            $scope.$apply(); // @TODO: Is this still needed?

            if (timeEntry.timing) {
                // Start the timer if needed.
                angular.element('.entryid-' + timeEntry.id + ' timer')[0].start();
            }
        });

        // Reset the notes field since we can be sure that won't be repeated
        // on the next entry. The other variables can stay in case they will be
        // repeated, to save repetitive entry.
        $scope.notes = '';

        // Finally, trigger the notes field again for rapid-fire entry.
        angular.element('.p2-notes').trigger('focus');
    };

    /**
     * Deletes a specific time entry from a specific day and populates the form
     * with its info for editing.
     *
     * @param {Object} entry
     * @param {String} day
     */
    $scope.editTime = function(entry, day) {
        $scope.notes = entry.notes;
        $scope.project = entry.project;
        $scope.tasks = OpenAirService.fetchTasks(entry.project);
        $scope.task = entry.task;
        $scope.time = entry.time.toFixed(3);
        $scope.when = [day];
        $scope.deleteTime(entry, day, true);
        angular.element('body').scrollTop(0);
    };

    /**
     * Edit the hours for a specific existing time entry. Used by the timer.
     *
     * This function runs every second while a timer is running, so it should
     * be as performant as possible.
     *
     * @TODO: Clean up this horrible, horrible function, and don't use a
     * forEach just to find and update 1 time entry.
     *
     * @param timeId
     * @param hours
     */
    $scope.editHours = function(timeId, hours) {
        var col = timeId.split('_')[1];
        col = col.split("")[1];
        if (col === 9) {
            col = 2;
        }
        var day = $scope.getDaysArray()[col - 2];

        angular.forEach($scope.timeEntries[day], function(entry) {
            if (entry.id === timeId) {
                entry.time = hours;
                OpenAirService.addHours(entry.id, hours);
                return;
            }
        });
    };

    /**
     * Deletes a specific time entry on a specific day.
     *
     * @param {Object} entry
     * @param {String} day
     */
    $scope.deleteTime = function(entry, day, edit) {
        if (!edit && !confirm('Are you sure you want to delete that time entry?')) {
            // Only ask for confirmation if we're really deleting instead of editing.
            return;
        }
        var entries = $scope.timeEntries[day];
        // Remove the chosen time entry from $scope.timeEntries.
        $scope.timeEntries[day] = entries.filter(function(element) {
            if (element.id === entry.id) {
                return false;
            }
            return true;
        });

        // Now that it's deleted from $scope.timeEntries, also remove it from the OA grid.
        OpenAirService.deleteTime(entry.id);
    };

    /**
     * Adds up all the time for a list of time entries and displays in HH:MM format..
     *
     * @param {Array} timeEntries
     * @returns {string}
     */
    $scope.sumTime = function(timeEntries) {
        var sum = 0;
        angular.forEach(timeEntries, function(entry) {
            sum += parseFloat(entry.time);
        });

        if ($scope.timeFormat === 'decimal') {
            // Cut out early if the user chose decimal time format instead of HH:MM.
            return parseFloat(sum.toFixed(3));
        }

        // Now that we have a decimal number of hours, format it like HH:MM.
        var hours = Math.floor(sum);
        var minutes = Math.floor((sum % 1) * 60);

        // Pad the minutes with a leading zero if needed.
        if (minutes < 10) {
            minutes = "0" + minutes;
        }

        return hours + ":" + minutes;
    };

    /**
     * Updates $scope.tasks once the value of $scope.project has been changed.
     */
    $scope.updateTasks = function() {
        var tasks = OpenAirService.fetchTasks($scope.project);
        $scope.tasks = tasks;
    };

    /**
     * Toggles a timer for a given time entry object.
     *
     * @param {Object} entry
     */
    $scope.toggleTimer = function(entry) {
        var $timer = angular.element('.entryid-' + entry.id + ' timer')[0];

        if (entry.timing) {
            $timer.stop();

        } else {

            if ($scope.multipleTimers === "0") {
                // The user has chosen to not allow multiple timers to be running at once
                // so we need to disable all currently running timers before starting this timer.
                angular.forEach($scope.weekdays, function(weekday) {
                    angular.forEach($scope.timeEntries[weekday.code], function(curEntry) {
                        if (curEntry.timing && curEntry.id !== entry.id) {
                            $scope.toggleTimer(curEntry);
                        }
                    });
                });
            }

            if (entry.timerStarted) {
                $timer.resume();
            } else {
                // This is the first time this timer has been started, so we
                // so we need to set timerStarted to true so that we know that
                // next time, we can resume instead of start over.
                $timer.start();
                entry.timerStarted = true;
            }
        }
        entry.timing = !entry.timing; // Used by the template to know if the timer is active.
    };

    // Called each time the timer "ticks" or changes, which is every second in our case.
    $scope.$on('timer-tick', function (event, data){
        var hours = data.millis / 1000 / 60 / 60;
        $scope.editHours(data.cellId, hours);

        if ($scope.$root.$$phase !== '$apply' && $scope.$root.$$phase !== '$digest') {
            // This is needed to get the daily time totals to stay up to date.
            $scope.$apply();
        }
    });

    /**
     * Return the 2 letter code of the current date.
     *
     * @TODO: Start using numbers instead of day codes. It'll remove a lot of dumb logic.
     *
     * @returns {String}
     */
    $scope.getDay = function() {
        var date = new Date();
        var weekdays = $scope.getDaysArray();
        return weekdays[date.getDay()];
    };

    /**
     * Attempt to load a saved setting, and if it doesn't exist, then just
     * initialize it from the passed in default value instead.
     *
     * @param {string} optionName
     * @param {mixed} defaultVal
     */
    $scope.loadSetting = function(optionName, defaultVal) {
        var exists = false;
        chrome.storage.sync.get(optionName, function (obj) {
            if (obj[optionName]) {
                exists = true;
                $scope[optionName] = obj[optionName];
            }
        });
        if (!exists) {
            $scope[optionName] = defaultVal;
        }
    };

    /**
     * Set up starter values for each of the fields in our form.
     */
    $scope.loadSettings = function() {
        $scope.loadSetting('timeFormat', 'hhmm');
        $scope.loadSetting('multipleTimers', 1);
    };

    /**
     * Simple conversion function, since we are using two letter
     * date codes instead of numbers.
     *
     * @TODO: Start using numbers instead of day codes. It'll remove a lot of dumb logic.
     *
     * @returns {Array}
     */
    $scope.getDaysArray = function() {
        var weekdays = new Array(7);
        weekdays[0]=  "su";
        weekdays[1] = "mo";
        weekdays[2] = "tu";
        weekdays[3] = "we";
        weekdays[4] = "th";
        weekdays[5] = "fr";
        weekdays[6] = "sa";
        return weekdays;
    };

    // Days of the week, to match code to day and cycle through in the view.
    $scope.weekdays = [
        {code: "mo", name: 'Monday', shortName: 'Mo'},
        {code: "tu", name: 'Tuesday', shortName: 'Tu'},
        {code: "we", name: 'Wednesday', shortName: 'We'},
        {code: "th", name: 'Thursday', shortName: 'Th'},
        {code: "fr", name: 'Friday', shortName: 'Fr'},
        {code: "sa", name: 'Saturday', shortName: 'Sa'},
        {code: "su", name: 'Sunday', shortName: 'Su'}
    ];

    // The time table is listed in reverse order.
    // @TODO: Use a filter instead.
    $scope.reverseWeekdays = $scope.weekdays.reverse();

    // Initialize the list of projects on page load.
    $scope.projects = OpenAirService.fetchProjects();

    // The list of tasks stays empty until a project is selected.
    $scope.tasks = {};

    // Initialize the time entries by grabbing them out of the OpenAir grid.
    $scope.timeEntries = OpenAirService.parseTimesheet();

    // Default the "Day" field to the current day.
    $scope.when = [$scope.getDay()];

    // Load in any user settings if saved, otherwise just load the defaults.
    $scope.loadSettings();

    // Update the submit button's value based on whether the time field has a vlue or not.
    $scope.$watch('time', function(newTime) {
        if (newTime) {
            $scope.submitButton = "Add";
        } else {
            $scope.submitButton = "Start";
        }
    });

    if (document.URL.indexOf('MESSAGE') === -1) {
        chrome.storage.sync.set({ timesheetUrl : document.URL });
    }

    /**
     * Adds an "Enter" key listener to submit the form on Enter press
     * if the fields have been filled out.
     *
     * @TODO: Use a directive instead.
     */
    document.addEventListener("keydown", function(e) {
        if (e.keyIdentifier === "Enter") {

            var $activeDropdowns = angular.element('.chosen-with-drop');
            if ($activeDropdowns.length) {
                // A chosen dropdown is active, so we may need to avoid submitting
                // the form just yet, and instead, just let Chosen select the
                // chosen option. Before we stop, though, we need to make sure it's
                // not the "Day" multi-select OR, if it is, that the search field
                // in there actually has a value. This weird hack exists because
                // multi-selects in Chosen display a dropdown even if you don't
                // type anything, and we only want to let it select a value in
                // the dropdown if something was actually typed, otherwise just
                // submit the form.
                if (!angular.element('.chosen-container-multi').hasClass('chosen-with-drop') || // The "Day" field is NOT active, OR
                    angular.element('.chosen-container-multi .search-field input').val() !== "") { // The "Day" field has a typed value
                    // Don't submit the form.
                    return;
                }
            }

            // Enter key was pressed! Can we submit the form?
            if ($scope.notes && $scope.project && $scope.task) {

                // Woohoo! We can add some time!
                $scope.addTime(e);

                // This .$apply() is needed when submitting the form in this
                // fashion, otherwise it re-renders fine without it.
                $scope.$apply();
            }
        }
    });
}]);