'use strict';

/*global angular:false */
/*global $:false */
/*global app:false */

app.controller('TimeEntryController', ['$scope', 'OpenAirService', function($scope, OpenAirService) {

    /**
     * Updates $scope.tasks once the value of $scope.project has been changed.
     */
    $scope.updateTasks = function() {
        var tasks = OpenAirService.fetchTasks($scope.project);
        $scope.tasks = tasks;
    };

    /**
     * Adds time to the list of time entries.
     */
    $scope.addTime = function(e) {
        e.preventDefault();

        if ($scope.when === "" || typeof $scope.when === "undefined" || $scope.when.length === 0) {
            $scope.when = [$scope.getDay()];
        }

        angular.forEach($scope.when, function(day) {
            var timeEntry = {
                time: $scope.time,
                project: $scope.project,
                projectName: OpenAirService.fetchProjects()[$scope.project],
                task: $scope.task,
                taskName: OpenAirService.fetchTasks($scope.project)[$scope.task],
                notes: $scope.notes
            };

            if (!$scope.timeEntries[day]) {
                $scope.timeEntries[day] = [];
            }
            $scope.timeEntries[day].push(timeEntry);
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
     * @param {Object} entry
     * @param {String} day
     */
    $scope.editTime = function(entry, day) {
        $scope.notes = entry.notes;
        $scope.project = entry.project;
        $scope.tasks = OpenAirService.fetchTasks(entry.project);
        $scope.task = entry.task;
        $scope.time = entry.time;
        $scope.when = [day];
        $scope.deleteTime(entry, day);
    };

    /**
     * Deletes a specific time entry on a specific day.
     * @param {Object} entry
     * @param {String} day
     */
    $scope.deleteTime = function(entry, day) {
        var entries = $scope.timeEntries[day];
        $scope.timeEntries[day] = entries.filter(function(element) {
            if (element.time === entry.time &&
                element.project === entry.project &&
                element.task === entry.task &&
                element.notes === entry.notes) {
                return false;
            }
            return true;
        });
    };

    /**
     * Adds up all the time for a list of time entries.
     * @param {Array} timeEntries
     * @returns {number} sum
     */
    $scope.sumTime = function(timeEntries) {
        var sum = 0;
        angular.forEach(timeEntries, function(entry) {
            sum += parseFloat(entry.time);
        });
        return sum;
    };

    /**
     * Return the 2 letter code of the current date.
     * @returns {String}
     */
    $scope.getDay = function() {
        var date = new Date();
        var weekday = new Array(7);
        weekday[0]=  "su";
        weekday[1] = "mo";
        weekday[2] = "tu";
        weekday[3] = "we";
        weekday[4] = "th";
        weekday[5] = "fr";
        weekday[6] = "sa";
        return weekday[date.getDay()];
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

    /**
     * Adds an "Enter" key listener to submit the form on Enter press
     * if the fields have been filled out.
     * @TODO: Use a directive instead.
     */
    document.addEventListener("keydown", function(e) {
        var key = e.which || e.keyCode;
        if (key === 13) {

            // Enter key was pressed! Can we submit the form?
            if ($scope.notes && $scope.project && $scope.task && $scope.time) {

                // Woohoo! We can add some time!
                $scope.addTime(e);

                // This .$apply() is needed when submitting the form in this
                // fashion, otherwise it re-renders fine without it.
                $scope.$apply();
            }
        }
    });
}]);