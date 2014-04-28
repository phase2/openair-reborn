$(document).ready(function() {

  var $form = $('<div class="p2_form-wrapper"></div>');
  var $row = $('<div class="p2_form-row"></div>');
  var $rowTwo = $('<div class="p2_form-row"></div>');

  $row.append('<div class="p2_form-input_group p2_one-whole"><label class="p2_form-label" for="p2_working_on">What are you working on?</label><input type="text" id="p2_working_on" name="p2_working_on" class="p2_input-field" /></div>');

  $rowTwo.append('<div class="p2_form-input_group p2_one-third"><label class="p2_form-label" for="p2_which_client">Which Client?</label><input type="text" id="p2_which_client" name"p2_which_client" class="p2_input-field" /></div>');
  $rowTwo.append('<div class="p2_form-input_group p2_one-third"><label class="p2_form-label" for="p2_which_task">Which Task?</label><input type="text" id="p2_which_task" name"p2_which_task" class="p2_input-field" /></div>');
  $rowTwo.append('<div class="p2_form-input_group p2_one-third"><label class="p2_form-label" for="p2_how_long">How Long?</label><input type="text" id="p2_how_long" name"p2_how_long" class="p2_input-field" /><div class="p2_form-submit_button"><input type="submit" class="p2_submit" value="Start" /></div></div>');

  $form
    .append($row)
    .append($rowTwo);

  $form.prependTo('#p2_content');

});
