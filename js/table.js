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

	var p2Mo = [],
		p2Tu = [],
		p2We = [],
		p2Th = [],
		p2Fr = [],
		p2Sa = [],
		p2Su = [];

	$.each( p2TimeEntries, function(i, v){
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

			var theNewTable = '<table>';
			$.each( arrayName, function(i, v){
				theNewTable = theNewTable + "<tr><td class='p2timeWorkingOn'>Client Work, Other Stuff, etc</td><td class='p2WhichClient'>"+v.project+"</td><td class='p2ProjectStatus'>Sprint 17</td><td class='p2TimeSpent'>1.25 h</td><td class='p2EditThis'><a href='#'>EDIT</a></td><td class='p2DeleteThis'>X</td></tr>";
			});
			theNewTable + '</table>';
			$('.'+tableClass).append( theNewTable );

		}
	}

	p2BringTheAction( p2Mo, 'newMondayTable', 'Monday' );
	p2BringTheAction( p2Tu, 'newTuesdayTable', 'Tuesday' );

});













