$(function(){

  var p2TimeEntries = [
    {
      'time': '0.5h',
      'date': 'Mo',
      'project': 'Kick all other teams ass',
      'task': 'Sprint 7',
      'notes': 'Did some work on the stuff yanno',
    },  
    {
      'time': '0.5h',
      'date': 'Mo',
      'project': 'Project Name',
      'task': 'Sprint 7',
      'notes': 'Did some work on the stuff yanno',
    },  
    {
      'time': '0.5h',
      'date': 'Mo',
      'project': 'Project Name',
      'task': 'Sprint 7',
      'notes': 'Did some work on the stuff yanno',
    },  
    {
      'time': '0.5h',
      'date': 'Mo',
      'project': 'Project Name',
      'task': 'Sprint 7',
      'notes': 'Did some work on the stuff yanno',
    },  
    {
      'time': '0.5h',
      'date': 'Tu',
      'project': 'Project Name',
      'task': 'Sprint 7',
      'notes': 'Did some work on the stuff yanno',
    }
  ];

  function parseTimeGrid(p2RealTime) {
    var p2_projects = [];
    $('.timesheetControlPopupCustomerProject option').each(function() {
      if ($(this).text().length > 0) {
        p2_projects[$(this).val()] = $(this).text();
      }
    });
    //console.log(p2_projects);

    var p2_time = [];
    $('.timesheetHours').each(function() {
      time = $(this).find('.timesheetInputHour').val();
      if (time.length < 1) {
        return;
      }
      date = $(this).find('a').attr('data-additional-title');
      date = date.substring(0, 2);
      project = $(this).parents('tr').find('.timesheetControlPopupCustomerProject').val();
      projectName = p2_projects[project];
      task = $(this).parents('tr').find('.timesheetControlPopup').val();
      taskName = $(this).parents('tr').find('.timesheetControlPopup option:selected').text();
      notesID = $(this).find('a').attr('data-additional-prefix');
      notes = $('input[name=' + notesID + '_dialog_notes]').val();
      p2_time.push(
        {
          time: time,
          date: date,
          project: project,
          projectName: projectName,
          task: task,
          taskName: taskName,
          notes: notes
        }
      );
    });
    
    p2RealTime = p2_time

    return p2RealTime;
  }

  var p2TimeEntriesReal = parseTimeGrid();

  console.log(p2TimeEntriesReal);

  var p2Mo = [],
    p2Tu = [],
    p2We = [],
    p2Th = [],
    p2Fr = [],
    p2Sa = [],
    p2Su = [];

  $.each( p2TimeEntriesReal, function(i, v){
    if ( v.date == 'Mo' ){
      p2Mo.push( v );
    } else if ( v.date == "Tu" ){
      p2Tu.push( v );
    } else if ( v.date == "We" ){
      p2We.push( v );
    } else if ( v.date == "Th" ){
      p2Th.push( v );
    } else if ( v.date == "Fr" ){
      p2Fr.push( v );
    } else if ( v.date == "Sa" ){
      p2Sa.push( v );
    } else if ( v.date == "Su" ){
      p2Su.push( v );
    }
  });

  var p2NewTimeTable = "<div class='p2TimeTableWrapper'><h1><strong>DAY NAME</strong> - <span>X.XX</span>h</h1></div>";

  function p2BringTheAction ( arrayName, tableClass, dayName ){
    if ( arrayName.length > 0 ){

      var theSpecialSauce = tableClass;

      $('#p2_content').append( $(p2NewTimeTable).addClass( tableClass ) );

      $('.'+tableClass+' h1 strong').html( dayName );

      var p2TotalTimeSpent = 0;
      var theNewTable = '<table>';
      $.each( arrayName, function(i, v){
        theNewTable = theNewTable + "<tr><td class='p2timeWorkingOn'>"+v.notes+"</td><td class='p2WhichClient'>"+v.projectName+"</td><td class='p2ProjectStatus'>"+v.taskName+"</td><td class='p2TimeSpent'>"+v.time+" h</td><td class='p2EditThis'><a href='#'>EDIT</a></td><td class='p2DeleteThis'><a href='#'>X</a></td></tr>";
        p2TotalTimeSpent = p2TotalTimeSpent + Number(v.time);
      });
      theNewTable + '</table>';
      $('.'+tableClass+' h1 span').html( p2TotalTimeSpent );
      $('.'+tableClass).append( theNewTable );

    }
  }

  p2BringTheAction( p2Mo, 'newMondayTable', 'Monday' );
  p2BringTheAction( p2Tu, 'newTuesdayTable', 'Tuesday' );
  p2BringTheAction( p2We, 'newWednesdayTable', 'Wednesday' );
  p2BringTheAction( p2Th, 'newThursdayTable', 'Thursday' );
  p2BringTheAction( p2Fr, 'newFridayTable', 'Friday' );
  p2BringTheAction( p2Sa, 'newSaturdayTable', 'Saturday' );
  p2BringTheAction( p2Su, 'newSundayTable', 'Sunday' );


  $('.p2DeleteThis a').click(function(e) {
    e.preventDefault();
    $(this).parents('tr').remove();
  });

  $('.p2EditThis a').click(function(e) {
    alert('Not working yet! Sorry!');
  });

});
