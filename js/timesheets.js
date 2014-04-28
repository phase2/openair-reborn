$(document).ready(function() {
  if ($('#timesheet_grid').length < 1) {
    return;
  }
  $('#timesheet_grid').after('<div id="p2_sidebar">This is the sidebar</div>')
  $('#timesheet_grid').after('<div id="p2_content">This is the content</div>')
});
