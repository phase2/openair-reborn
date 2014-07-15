'use strict';

/*global $:false */
/*global app:false */
/*global angular:false */

/**
 * A bunch of helper functions to get data from OA and put data into OA.
 */
app.service('OpenAirService', function() {

    var parent = this; // Used in functions below to reference other functions below.

    /**
     * Returns the list of available projects in a key: value object.
     *
     * @returns {Object} projects
     */
    this.fetchProjects = function() {
        var projects = {};

        // Any Project select input will do, and we can be sure that there is
        // at least one on the page at all times, so just grab the first one
        // and loop through the options to build our list.
        $('.timesheetControlPopupCustomerProject').first().find('option').each(function () {
            if ($(this).text().length > 0) {
                projects[$(this).val()] = $(this).text();
            }
        });
        return projects;
    };

    /**
     * Returns the list of available tasks for a given project in a key: value object.
     *
     * @param projectId
     * @returns {Object} tasks
     */
    this.fetchTasks = function(projectId) {
        var tasks = {};

        // First we need to see if a row already exists for this project,
        // because if so, then we can just grab the tasks out of the "Tasks"
        // dropdown that exists in that row already.
        var $selects = [];
        $selects = $('.timesheetControlPopupCustomerProject').filter(function() {
            return $(this).val() === projectId;
        });

        var $taskoptions;
        if ($selects.length) {
            // Yay! We already have a "Tasks" dropdown for that project, so we
            // can just use that and move on.
            $taskoptions = $selects.first().parent().next().find('option');

        } else {
            // Sigh, none already exist, so we must create our own.
            parent.createNewRow(projectId);

            // Now that the Tasks select input is populated, we can fetch the values out
            // of it. However, There are no sane CSS selectors for that select input,
            // so we end up with this monstrosity.
            $taskoptions = $('.timesheetControlPopupCustomerProject').eq(-2).parent().next().find('option');
        }

        // Now that we have our "Tasks" dropdown, let's loop through the options
        // to build our formatted "tasks" object and return it.
        $taskoptions.each(function () {
            if ($(this).text().length > 0 && $(this).val() !== "0") {
                // Let's use a .split() to remove the useless number from the task's label.
                var label = $(this).text().split(': ')[1];
                tasks[$(this).val()] = label;
            }
        });
        return tasks;
    };

    /**
     * Creates a new row at the end of the timesheet for a given project and
     * triggers a click on it so that the task dropdown populates.
     *
     * @param {string} projectId
     */
    this.createNewRow = function(projectId) {
        // First, set the value of the last "Project" OA select (i.e., the
        // empty one) to be the one we just chose, behind the scenes.
        $('.timesheetControlPopupCustomerProject').last().val(projectId);

        // This is a horrible and slow hack. Chrome extensions don't have the
        // ability to .trigger('change'); on an element, which is the only "easy"
        // way to find the Tasks for a given Project. I.e., we need to trigger
        // a change to the Project select so that the Tasks select after it
        // will be populated, and we can grab those options. We can do that by
        // building our own <script> DOM element and inserting it. :(
        // Stolen/modified from http://stackoverflow.com/a/11388087, and yes
        // I tried the .dispatchEvent() idea first, and it didn't work.
        var s = document.createElement('script');
        s.textContent = "jQuery('.timesheetControlPopupCustomerProject').last().trigger('change')";
        s.onload = function () {
            this.parentNode.removeChild(this);
        };
        document.head.appendChild(s);
    };

    /**
     * Cycles through the default OA timesheet and grabs time entries out of
     * it to populate the initial $scope.timeEntries on page load, which is
     * a multi-dimensional array grouped by the day of the week.
     *
     * @returns {Array} timeEntries
     */
    this.parseTimesheet = function() {
        var timeEntries = [];
        var projects = parent.fetchProjects();

        $('.timesheetHours').each(function () {
            var time = $(this).find('.timesheetInputHour').val();
            if (time.length < 1) {
                // This one's empty, so skip it.
                return;
            }
            var date = $(this).find('a').attr('data-additional-title').substring(0, 2).toLowerCase();
            var project = $(this).parents('tr').find('.timesheetControlPopupCustomerProject').val();
            var projectName = projects[project].split(' : ')[1];
            var task = $(this).parents('tr').find('.timesheetControlPopup').val();
            var taskName = $(this).parents('tr').find('.timesheetControlPopup option:selected').text().split(': ')[1];
            var notesId = $(this).find('a').attr('data-additional-prefix');
            var notes = parent.findNotes(notesId);
            var id = $(this).find('input').attr('id');
            if (!timeEntries[date]) {
                timeEntries[date] = [];
            }
            timeEntries[date].push({
                time: time,
                project: project,
                projectName: projectName,
                task: task,
                taskName: taskName,
                notes: notes,
                id: id
            });
        });
        return timeEntries;
    };

    /**
     * Given a timeEntry object, add the data for it to the OA time grid,
     * into the first available cell.
     *
     * @param {Object} timeEntry
     * @returns {string}
     */
    this.addTime = function(timeEntry) {
        // First we need to see if there's a row in the timesheet for this
        // project and task combination already.
        var cellId = this.findOpenCell(timeEntry.project, timeEntry.task, timeEntry.day);
        $('#' + cellId).val(timeEntry.time);
        var notesId = cellId.replace("ts", "");
        parent.addNotes(timeEntry.notes, notesId);
        return cellId;
    };

    /**
     * Finds the ID of the first open cell that matches the day, project, and task
     * passed in. Creates a new row if needed before doing so.
     *
     * @param {string} project
     * @param {string} task
     * @param {string} day
     * @returns {string}
     */
    this.findOpenCell = function(project, task, day) {
        var emptyCellId;
        $('.timesheet tr').each(function() {
            var $rowProject = $(this).find('.timesheetControlPopupCustomerProject');
            var $rowTask = $(this).find('.timesheetControlPopup');
            if ($rowProject.val() !== project || $rowTask.val() !== task) {
                // Either the project or the task isn't a match, so skip it.
                return;
            }
            var cellId = parent.findTimeCellId($rowProject.attr('id'), day);
            if ($('#' + cellId).val() !== "") {
                return;
            }
            emptyCellId = cellId;
            return false;
        });

        if (!emptyCellId) {
            parent.createNewRow(project);
            $('.timesheetControlPopup').eq(-2).val(task); // Set the task dropdown value.
            var projectCellId = $('.timesheetControlPopupCustomerProject').eq(-2).attr('id');
            emptyCellId = parent.findTimeCellId(projectCellId, day);
        }

        return emptyCellId;
    };

    /**
     * Generates the ID of a time entry cell based on the day and the ID of the
     * project dropdown.
     *
     * Cells are all in the format "ts_c<column>_r<row>" so we just replace
     * the column with the one for the day and the rest stays the same as the
     * project dropdown iD.
     *
     * @param {string} projectCellId
     * @param {int} day
     * @returns {string}
     */
    this.findTimeCellId = function(projectCellId, day) {
        var idParts = projectCellId.split('_');
        var rowNum = idParts[2];
        var colNum = parent.getDayNum(day) + 3;
        var cellId = 'ts_c' + colNum + '_' + rowNum;
        return cellId;
    };

    /**
     * Given a notesId which is easy to find, find the actual note which
     * is pants-on-head difficult to find, involving parsing JSON out of a
     * <script> tag and traversing it until you find the right ID.
     *
     * @param {string} notesId
     * @returns {string} notes
     */
    this.findNotes = function(notesId) {
        var timeData = JSON.parse($('#oa_model_timesheet').html());
        var notes = "test";
        angular.forEach(timeData.rows, function(row) {
            angular.forEach(row.fields, function(field) {
                if (field.id === notesId) {
                    notes = field.details.data.notes;
                }
            });
        });
        return notes;
    };

    /**
     * Adds notes for a specific time entry into the OpenAir global OA object.
     *
     * @param {string} notes
     * @param {string} notesId
     */
    this.addNotes = function(notes, notesId) {
        var idAttr = '#ts_notes' + notesId;
        notes = notes.replace(/'/g, "&#39;"); // Escape single quotes if they exist.

        // To populate notes, we need to programmatically go through the routine
        // of clicking the "notes" link, populating the textarea, and submitting
        // the popup, since OA of course couldn't make it as easy as setting
        // the value of an input. Chrome extensions can't trigger things, so
        // we have to insert a new <script> tag into the page with the code
        // we want to run (see note in fetchTasks() for more info).
        var s = document.createElement('script');
        s.textContent = "jQuery('" + idAttr + "').trigger('click');";
        s.textContent += "jQuery('#tm_notes').val('" + notes + "');";
        s.textContent += "jQuery('.dialogOkButton').trigger('click');";
        s.onload = function () {
            this.parentNode.removeChild(this);
        };
        document.head.appendChild(s);
    };

    /**
     * Delete a time entry from the OpenAir timesheet grid, by ID.
     *
     * Note that we don't have to remove anything besides the hours field, since
     * OA will remove everything else the next time it's saved if the hours
     * field is empty.
     *
     * @param {string} id
     */
    this.deleteTime = function(id) {
        $('#' + id).val('');
    };

    /**
     * Helper function to convert two digit day code to integer.
     *
     * @param {string} dayCode
     * @returns {int}
     */
    this.getDayNum = function(dayCode) {
        var  weekdays = [];
        weekdays.mo = 0;
        weekdays.tu = 1;
        weekdays.we = 2;
        weekdays.th = 3;
        weekdays.fr = 4;
        weekdays.sa = 5;
        weekdays.su = 6;
        return weekdays[dayCode];
    };
});