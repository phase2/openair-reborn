$(document).ready(function() {

  var $form = $('<div class="p2_form-wrapper"></div>');
  $form.append('<div class="p2_form-input_group"><label for="p2_working_on">What are you working on?</label><input type="text" id="p2_working_on" name="p2_working_on" /></div>');
  $form.append('<div class="p2_form-input_group"<label for="p2_which_client">Which Client?</label><input type="text" id="p2_which_client" name"p2_which_client" /></div>');
  $form.append('<div class="p2_form-input_group"<label for="p2_which_task">Which Task?</label><input type="text" id="p2_which_task" name"p2_which_task" /></div>');
  $form.append('<div class="p2_form-input_group"<label for="p2_how_long">How Long?</label><input type="text" id="p2_how_long" name"p2_how_long" /></div>');
  $form.append('<div class="p2_form-submit_button"><input type="submit" value="Start" /></div>');

  $form.appendTo('#timesheet_grid');

});
