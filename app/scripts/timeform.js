//'use strict';
//
//$(document).ready(function () {
//
//    var $form = $('<div class="p2_form-wrapper"></div>');
//    var $row = $('<div class="p2_form-row"></div>');
//    var $rowTwo = $('<div class="p2_form-row"></div>');
//
//    $row.append('<div class="p2_form-input_group p2_one-whole"><label class="p2_form-label" for="p2_working_on">What are you working on?</label><input type="text" id="p2_working_on" name="p2_working_on" class="p2_input-field" /></div>');
//
//    $rowTwo.append('<div class="p2_form-input_group p2_which_client_wrapper"><label class="p2_form-label" for="p2_which_client">Which Client?</label><select id="p2_which_client" name="p2_which_client" class="p2_input-field" ></select></div>');
//    $rowTwo.append('<div class="p2_form-input_group p2_which_task_wrapper"><label class="p2_form-label" for="p2_which_task">Which Task?</label><select id="p2_which_task" name="p2_which_task" class="p2_input-field"></select></div>');
//    $rowTwo.append('<div class="p2_form-input_group p2_how_long_wrapper"><label class="p2_form-label" for="p2_how_long">How Long?</label><input type="text" id="p2_how_long" name"p2_how_long" class="p2_input-field" /></div>');
//    $rowTwo.append('<div class="p2_form-input_group p2_when_wrapper"><label class="p2_form-label" for="p2_when">When?</label><input type="text" id="p2_when" name"p2_when" class="p2_input-field" /></div>');
//    $rowTwo.append('<div class="p2_form-submit_button"><input type="submit" class="p2_submit" value="Start" /></div>');
//
//    $form
//        .append($row)
//        .append($rowTwo);
//
//    $form.prependTo('#p2_content');
//
//    $('#p2_which_client').append('<option value=""></option>')
//    $('.timesheetControlPopupCustomerProject').first().find('option').each(function () {
//        if ($(this).text().length > 0) {
//            $('#p2_which_client').append('<option value="' + $(this).val() + '">' + $(this).text() + '</option>')
//        }
//    });
//
//    $('#p2_how_long').on('input', function () {
//        if ($(this).val() === '') {
//            $('.p2_submit').val('Start');
//        } else {
//            $('.p2_submit').val('Add');
//        }
//    });
//
//    $('#p2_which_client').chosen();
//    $('#p2_which_task').chosen();
//
//    $('#p2_which_client').change(function () {
//        $('.timesheetControlPopupCustomerProject').last().val($('#p2_which_client').val());
//        var s = document.createElement('script');
//        s.textContent = "jQuery('.timesheetControlPopupCustomerProject').trigger('change')";
//        s.onload = function () {
//            this.parentNode.removeChild(this);
//        };
//        document.head.appendChild(s);
//        $('#p2_which_task').html();
//        $('.timesheetControlPopupCustomerProject').eq(-2).parent().next().find('option').each(function () {
//            if ($(this).text().length > 0) {
//                $('#p2_which_task').append('<option value="' + $(this).val() + '">' + $(this).text() + '</option>')
//            }
//        });
//        $("#p2_which_task").trigger("chosen:updated");
//    });
//
//
//    $('.p2_submit').click(function (e) {
//        e.preventDefault();
//        addTime();
//    });
//    // Thsi doesn't work.
//    $('.p2_input_field').keypress(function (e) {
//        e.preventDefault();
//        if (e.which === 13) {
//            addTime();
//            return false;
//        }
//    });
//
//});
//
//function addTime() {
//    var notes = $('#p2_working_on').val();
//    var client = $('#p2_which_client option:selected').text();
//    var task = $('#p2_which_task option:selected').text();
//    var hours = $('#p2_how_long').val();
//    day = $('#p2_when').val();
//    if (day.length < 1) {
//        var d = new Date();
//        var weekday = new Array(7);
//        weekday[0] = "Sunday";
//        weekday[1] = "Monday";
//        weekday[2] = "Tuesday";
//        weekday[3] = "Wednesday";
//        weekday[4] = "Thursday";
//        weekday[5] = "Friday";
//        weekday[6] = "Saturday";
//
//        var day = weekday[d.getDay()];
//    }
//    var timeEntry = {
//        notes: notes,
//        client: client,
//        task: task,
//        hours: hours,
//        day: day
//    };
//
//    var newRow = "<tr><td class='p2timeWorkingOn'>" + notes + "</td><td class='p2WhichClient'>" + client + "</td><td class='p2ProjectStatus'>" + task + "</td><td class='p2TimeSpent'>" + hours + " h</td><td class='p2EditThis'><a href='#'>EDIT</a></td><td class='p2DeleteThis'><a href='#'>X</a></td></tr>";
//
//    var table = $('.new' + day + 'Table table');
//    table.prepend(newRow);
//    $('#p2_working_on').val('');
//    $('#p2_which_client').val('');
//    $('#p2_which_task').val('');
//    $('#p2_how_long').val('');
//    $('#p2_when').val('');
//    $('#p2_working_on').focus();
//    $("#p2_which_client").trigger("chosen:updated");
//    $("#p2_which_task").trigger("chosen:updated");
//}