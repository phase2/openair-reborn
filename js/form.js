$(document).ready(function() {

  var $form = $('<div class="p2_form-wrapper"></div>');
  var $row = $('<div class="p2_form-row"></div>');
  var $rowTwo = $('<div class="p2_form-row"></div>');

  $row.append('<div class="p2_form-input_group p2_one-whole"><label class="p2_form-label" for="p2_working_on">What are you working on?</label><input type="text" id="p2_working_on" name="p2_working_on" class="p2_input-field" /></div>');

  $rowTwo.append('<div class="p2_form-input_group p2_which_client_wrapper"><label class="p2_form-label" for="p2_which_client">Which Client?</label><select id="p2_which_client" name="p2_which_client" class="p2_input-field" ></select></div>');
  $rowTwo.append('<div class="p2_form-input_group p2_which_task_wrapper"><label class="p2_form-label" for="p2_which_task">Which Task?</label><select id="p2_which_task" name="p2_which_task" class="p2_input-field"></select></div>');
  $rowTwo.append('<div class="p2_form-input_group p2_how_long_wrapper"><label class="p2_form-label" for="p2_how_long">How Long?</label><input type="text" id="p2_how_long" name"p2_how_long" class="p2_input-field" /></div>');
  $rowTwo.append('<div class="p2_form-input_group p2_when_wrapper"><label class="p2_form-label" for="p2_when">When?</label><input type="text" id="p2_when" name"p2_when" class="p2_input-field" value="today" /></div>');
  $rowTwo.append('<div class="p2_form-submit_button"><input type="submit" class="p2_submit" value="Start" /></div>');

  $form
    .append($row)
    .append($rowTwo);

  $form.prependTo('#p2_content');

  var p2_projects = [];
  $('#p2_which_client').append('<option value=""></option>')
  $('.timesheetControlPopupCustomerProject').first().find('option').each(function() {
    if ($(this).text().length > 0) {
      $('#p2_which_client').append('<option value="' + $(this).val() + '">' + $(this).text() + '</option>')
    }
  });

  $('#p2_how_long').on('input', function() {
    if ($(this).val() == '') {
      $('.p2_submit').val('Start');
    } else {
      $('.p2_submit').val('Add');
    }
  });

  $('#p2_which_client').chosen();
  $('#p2_which_task').chosen();

  $('#p2_which_client').change(function() {
    $('.timesheetControlPopupCustomerProject').last().val($('#p2_which_client').val());
    var s = document.createElement('script');
    s.textContent = "jQuery('.timesheetControlPopupCustomerProject').trigger('change')";
    s.onload = function() {
      this.parentNode.removeChild(this);
    };
    document.head.appendChild(s);
    $('#p2_which_task').html();
    $('.timesheetControlPopupCustomerProject').eq(-2).parent().next().find('option').each(function() {
      if ($(this).text().length > 0) {
        $('#p2_which_task').append('<option value="' + $(this).val() + '">' + $(this).text() + '</option>')
      }
    });
    $("#p2_which_task").trigger("chosen:updated");
  });


  $('.p2_submit').click(function(e) {
    notes = $('#p2_working_on').val();
    client = $('#p2_which_client').val();
    task = $('#p2_which_task').val();
    hours = $('#p2_how_long').val();
    day = $('#p2_when').val();
    var timeEntry = {
      notes: notes,
      client: client,
      task: task,
      hours: hours,
      day: day
    };

    addTime(timeEntry);
  });

});

function addTime(timeEntry) {
  //date = $(this).find('a').attr('data-additional-title');
  //date = date.substring(0, 2);
  //project = $(this).parents('tr').find('.timesheetControlPopupCustomerProject').val();
  //projectName = p2_projects[project];
  //task = $(this).parents('tr').find('.timesheetControlPopup').val();
  //taskName = $(this).parents('tr').find('.timesheetControlPopup option:selected').text();
  //notesID = $(this).find('a').attr('data-additional-prefix');
  //notes = $('input[name=' + notesID + '_dialog_notes]').val();
}
