angular.module('timeTracker.controllers', [])


// A simple controller that fetches a list of data from a service
.controller('ProjectIndexCtrl', function($scope, ProjectsService) {

  //.controller('ProjectIndexCtrl', function($scope, ProjectsService) {
  $scope.projects = ProjectsService.all();
  $scope.pageTitle = 'My Projects';

  $scope.rightButtons = [
    {
      type: 'button button-icon',
      content: '<i class="icon ion-plus"></i>',
      tap: function(e) {
        $scope.openProjectModal();
      }
    }
  ]
})

.controller('projects', function($scope, $ionicModal, $ionicActionSheet, ProjectsService) {
  $scope.projects = ProjectsService.all();
 $scope.projectAddTemp = function() {
   $ionicModal.fromTemplateUrl('templates/modals/add_project.html', function(modal) {
    $scope.projectAdd = modal;
    $scope.projectAdd.show();
     }, {
       // Use our scope for the scope of the modal to keep it simple
       scope: $scope,
       // The animation we want to use for the modal entrance
       animation: 'slide-in-up'
     });
  }

$scope.startTaskTemp = function() {
 $ionicModal.fromTemplateUrl('templates/modals/start_task.html', function(modal) {

  $scope.startTask = modal;
  $scope.startTask.show();
   }, {
     // Use our scope for the scope of the modal to keep it simple
     scope: $scope,
     // The animation we want to use for the modal entrance
     animation: 'slide-in-up'
   });
  }

  $scope.endTaskTemp = function() {
 $ionicModal.fromTemplateUrl('templates/modals/end_task.html', function(modal) {
  $scope.endTask = modal;
  $scope.endTask.show();
   }, {
     // Use our scope for the scope of the modal to keep it simple
     scope: $scope,
     // The animation we want to use for the modal entrance
     animation: 'slide-in-up'
   });
  }

 $scope.openProjectModal = function() {
     $scope.projectAddTemp();
   };
 $scope.closeProjectModal = function() {
     $scope.projectAdd.hide();
   };
 $scope.openStartTaskModal = function(openedProject) {
  // console.log('owihgoewhgoehgowhegohwegohweoghewoghowehgoiewhgo');
    $scope.openedProject = ProjectsService.get(openedProject).subtasks;
    // console.log($scope.openedProject);
      $scope.startTaskTemp();
   };
$scope.closeStartTaskModal = function() {
     $scope.startTask.hide();
     $scope.startTask.remove();
      delete $scope.startTask;
   };

    $scope.openEndTaskModal = function(openedProject) {
       $scope.openedProjectRunning = ProjectsService.get(openedProject).$child('runningTimers');
       $scope.selectedEndProject = openedProject;
         $scope.endTaskTemp();
      };
   $scope.closeEndTaskModal = function() {
        $scope.endTask.hide();
        $scope.endTask.remove();
         delete $scope.endTask;
      };

     //Be sure to cleanup the modal
     $scope.$on('$destroy', function() {
       $scope.projectAdd.remove();
       $scope.subtaskAdd.remove();
       $scope.startTask.remove();
       $scope.endTask.remove();
       $scope.taskEntryEdit.remove();
     });
  $scope.newProject = function(project) {
  if(project) {
    // var projectTemp = $scope.projects;
    // projectTemp = projectTemp[project.projectName];
    // projectTemp.projectTitle = project.projectName;
    //
    // $scope.projects.push({ProjectTitle: project.projectName});
    $scope.projects[project.projectName] = {ProjectTitle: project.projectName};
    // console.log($scope.projects);
    ProjectsService.set($scope.projects);

    // $scope.projects.$child(project.projectName).$update({ProjectTitle: project.projectName});
    $scope.projectAdd.hide();
  }

  };

//Start our timer
  $scope.startTrackingTask = function(taskInfo) {
    var t = Date.now();
    // var t = Math.round(new Date().getTime()/1000);
    var newTimer = taskInfo;
    newTimer.StartTime = t;
    // console.log(taskInfo);
    // $scope.projects[project.projectName] = {ProjectTitle: project.projectName};
    // console.log($scope.projects);
    // ProjectsService.set($scope.projects);
    //
    //
    // $scope.projects[$scope.selectedStartProject].runningTimers['newTimer']['TaskName'] = taskInfo;
    // console.log($scope.projects[$scope.selectedStartProject].runningTimers);
    // $scope.closeStartTaskModal();
//
// console.log($scope.projects[$scope.selectedStartProject].runningTimers.newTimer);

    // $scope.projects.$child($scope.selectedStartProject).$child('runningTimers').$child(newTimer.TaskName).$update(newTimer);
    // $scope.closeStartTaskModal();
  }

  //Stop our timer
    $scope.stopTrackingTask = function() {

    }

  $scope.itemButtons = [
    {
      text: 'start',
      type: 'button-calm',
      onTap: function(e) {
        $scope.selectedStartProject = e;
        $scope.openStartTaskModal(e);
      }
    },
    {
      text: 'stop',
      type: 'button-assertive',
      onTap: function(e) {
        $scope.selectedStopProject = e;
        $scope.openEndTaskModal(e);
      }
    }
  ];

  $scope.runningTaskButton = [
  {
      text: 'end',
      type: 'button-assertive',
      onTap: function(e) {
        $scope.endTaskChoice(e);
      }
    }
  ];
  // Triggered on a button click, or some other target
  $scope.endTaskChoice = function(e) {
    var t = Date.now();
    // var t = Math.round(new Date().getTime()/1000);
    // $scope.projects.$child($scope.selectedEndProject).$child('runningTimers').$child(e).$update({EndingTimer: t});
    var timerObj;
    // var julieRef = new Firebase('https://time-tracker123.firebaseio.com/').child($scope.selectedEndProject).child('runningTimers').child(e);
    // julieRef.on('value', function(snapshot) {
    //   if(snapshot.val() !== null) {
    //     timerObj = snapshot.val();
    //     $scope.projects.$child($scope.selectedEndProject).$child('time').$add(timerObj);
    //     $scope.projects.$child($scope.selectedEndProject).$child('runningTimers').$remove(e);
    //   }
    // });

  }

})

// // A simple controller that shows a tapped item's data
.controller('ProjectDetailCtrl', function($scope, $ionicModal, $stateParams, ProjectsService) {
  $scope.projects = ProjectsService.get($stateParams.trackerId);
  // console.log('PROJECT DETAIL CTRL');
  // console.log($scope.projects);
  $scope.subtasks = $scope.projects.subtasks;
  // $scope.subtasks = $scope.projects.$child('subtasks');
$scope.subtaskAddTemp = function() {
$ionicModal.fromTemplateUrl('templates/modals/task_.html', function(modal) {
  $scope.subtaskAdd = modal;
  $scope.subtaskAdd.show();
   }, {
     // Use our scope for the scope of the modal to keep it simple
     scope: $scope,
     // The animation we want to use for the modal entrance
     animation: 'slide-in-up'
   });
}


  $scope.pageTitle = $scope.projects.$id;

  $scope.rightButtons = [
    {
      type: 'button button-icon',
      content: '<i class="icon ion-plus"></i>',
      tap: function(e) {
        $scope.openSubTaskModal();
      }
    }
  ];


  $scope.openSubTaskModal = function(project) {
      $scope.subtaskAddTemp();
    };
    $scope.closeSubtaskModal = function() {
     $scope.subtaskAdd.hide();
   };
    $scope.subTasks = function(subTask) {
      if(subTask){
        // $scope.projects.$child('subtasks').$child(subTask.subtaskName).$update({SubTaskTitle: subTask.subtaskName});
        // $scope.subtaskAdd.hide();
      }
    }

})

.controller('ProjectSubDetailCtrl', function($scope, $ionicModal, $stateParams, ProjectsService) {
  var snapshot = ProjectsService.get($stateParams.trackerId);
  // var julieRef2 = new Firebase('https://time-tracker123.firebaseio.com/').child($stateParams.trackerId);
  $scope.taskEntryEditTemp = function() {
    $ionicModal.fromTemplateUrl('templates/modals/task_entry_detail.html', function(modal) {
     $scope.taskEntryEdit = modal;
     $scope.taskEntryEdit.show();
      }, {
        // Use our scope for the scope of the modal to keep it simple
        scope: $scope,
        // The animation we want to use for the modal entrance
        animation: 'slide-in-up'
      });
   }
   $scope.openTaskEntryEditModal = function() {
       $scope.taskEntryEditTemp();
     };
   $scope.closeTaskEntryEditModal = function() {
       $scope.taskEntryEdit.hide();
     };

    $scope.updateTaskDetail = function(info) {
        var timeEntryKey = info.timeCollection;
        delete info['timeCollection'];
        // $scope.projects.$child($stateParams.trackerId).$child('time').$child(timeEntryKey).$update(info);
         // $scope.closeTaskEntryEditModal;
    }
    $scope.deleteTaskDetail = function(info) {
      // var timeEntryKey = info.timeCollection;
      // delete info['timeCollection'];
      // $scope.projects.$child($stateParams.trackerId).$child('time').$child(timeEntryKey).$remove();
      // $scope.closeTaskEntryEditModal;
    }

     $scope.taskDetail = [
    {
      text: 'edit',
      type: 'button-calm',
      onTap: function(e) {
        $scope.taskEditInfo = e;
        $scope.openTaskEntryEditModal(e);
      }
    },
  ];

  $scope.timingHours = function(startTime, endTime) {
    var d1 = endTime;
    var d2 = startTime;
    // console.log('----------------');
    // console.log('d1: ' + d1);
    // console.log('d2:' + d2);
    // console.log('===========');
    var diff = Math.abs(d1 - d2);
    return Math.round((((diff / 1000) / 60) / 60));
  };

  $scope.timingMinutes = function(startTime, endTime) {
    var d1 = endTime;
    var d2 = startTime;
    var diff = Math.abs(d1 - d2);
    return (Math.round(((diff / 1000) / 60)) % 60);
  };

  $scope.timingSeconds = function(startTime, endTime) {
    var d1 = endTime;
    var d2 = startTime;
    var diff = Math.abs(d1 - d2);
    return (Math.round((diff / 1000)) % 60);
  };


  var sub = snapshot.subtasks[$stateParams.trackerSubId].SubTaskTitle;
  var timeEntries = snapshot.time;
  var taskEntry = {};
   var i = 0;
   for (var key in timeEntries) {
      var obj = timeEntries[key];
      if(obj.TaskName == sub) {
       taskEntry[i] = obj;
       taskEntry[i].timeCollection = key;
       i++;
      }
    }
    for (var key in taskEntry) {
         var startingTime = taskEntry[key].StartTime;
         var endingTime = taskEntry[key].EndingTimer;
         // console.log('start: ' + startingTime);
         // console.log('end: ' + endingTime);
         // console.log('Starting Time: ' + $scope.timingHours(startingTime, endingTime));
         // console.log('Ending Time: ' + endingTime);
          taskEntry[key].totalTime = $scope.timingHours(startingTime, endingTime) + 'h, ' + $scope.timingMinutes(startingTime, endingTime) + 'm, ' + $scope.timingSeconds(startingTime, endingTime) + 's';
       }
       $scope.taskEntry = taskEntry;

  // julieRef2.on('value', function(snapshot) {
    // if(snapshot.val() !== null) {
      // var sub = snapshot.val().subtasks[$stateParams.trackerSubId].SubTaskTitle;
    //   var timeEntries = snapshot.val().time;
    //   var taskEntry = {};
    //   var i = 0;
    //   for (var key in timeEntries) {
    //      var obj = timeEntries[key];
    //      if(obj.TaskName == sub) {
    //       taskEntry[i] = obj;
    //       taskEntry[i].timeCollection = key;
    //       i++;
    //      }

    //   }

    //   for (var key in taskEntry) {
    //     var startingTime = taskEntry[key].StartTime;
    //     var endingTime = taskEntry[key].EndingTimer;
    //      taskEntry[key].totalTime = $scope.timingHours(startingTime, endingTime) + 'h, ' + $scope.timingMinutes(startingTime, endingTime) + 'm, ' + $scope.timingSeconds(startingTime, endingTime) + 's';
    //   }
    //   $scope.taskEntry = taskEntry;
    // }
  // });

})
.controller('runningTimerTab', function($scope, $interval, $stateParams, ProjectsService) {
  // var ref = new Firebase('https://time-tracker123.firebaseio.com/');

  $scope.runningTimersTab = {};
  $scope.runningProjects = {};
  // $scope.ticker = function(key1, key2) {
  //   $interval(function() {
  //       if($scope.runningTimersTab[key1]){
  //       $scope.runningTimersTab[key1]['ProjectTasks'][key2].hoursTime = $scope.timingHours($scope.runningTimersTab[key1]['ProjectTasks'][key2]['StartTime']);
  //       $scope.runningTimersTab[key1]['ProjectTasks'][key2].minutesTime = $scope.timingMinutes($scope.runningTimersTab[key1]['ProjectTasks'][key2]['StartTime']);
  //       $scope.runningTimersTab[key1]['ProjectTasks'][key2].secondsTime = $scope.timingSeconds($scope.runningTimersTab[key1]['ProjectTasks'][key2]['StartTime']);
  //       }
  //     }, 100);
  // }

  $scope.timingHours = function(startTime) {
    var d1 = Date.now();
    var d2 = startTime
    var diff = Math.abs(d1 - d2);
    return Math.floor((((diff / 1000) / 60) / 60));
  };

  $scope.timingMinutes = function(startTime) {
    var d1 = Date.now();
    var d2 = startTime
    var diff = Math.abs(d1 - d2);
    return (Math.floor(((diff / 1000) / 60)) % 60);
  };

  $scope.timingSeconds = function(startTime) {
    var d1 = Date.now();
    var d2 = startTime
    var diff = Math.abs(d1 - d2);
    return (Math.floor((diff / 1000)) % 60);
  };

  $scope.endRunningTask = function(e) {
    var t = Date.now();
    var projectTitle = e.ProjectTitle;
    var TaskName = e.TaskName;
    // $scope.projects.$child(projectTitle).$child('runningTimers').$child(TaskName).$update({EndingTimer: t});
    var timerObj;
    // var ref3 = new Firebase('https://time-tracker123.firebaseio.com/').child(projectTitle).child('runningTimers').child(TaskName);
    // ref3.on('value', function(snapshot) {
    //   if(snapshot.val() !== null && e) {
    //     timerObj = snapshot.val();
    //     $scope.projects.$child(projectTitle).$child('time').$add(timerObj);
    //     $scope.projects.$child(projectTitle).$child('runningTimers').$remove(TaskName);
    //   }
    // });
  }

  $scope.runningTaskEnd = [
  {
      text: 'end',
      type: 'button-assertive',
      onTap: function(e) {
        $scope.endRunningTask(e);
      }
    }
  ];

  // ref.on('value', function(snapshot) {
  //   if(snapshot.val() !== null) {
  //     $scope.runningTimersTab = {};
  //     var projectList = snapshot.val();
  //     for (var key in projectList) {
  //       if(projectList[key]['runningTimers']) {
  //         var placeholder = projectList[key];
  //         var keyTemp = key;
  //          $scope.runningTimersTab[key] = {ProjectName: key};
  //          $scope.runningTimersTab[key]['ProjectTasks'] = projectList[key]['runningTimers'];
  //          for (var key2 in $scope.runningTimersTab[key]['ProjectTasks']) {
  //           $scope.ticker(key, key2);
  //               $scope.runningTimersTab[key]['ProjectTasks'][key2].ProjectTitle = key;
  //          }
  //       }
  //     }
  //   }
  // });


})
.filter('escape', function() {
  return window.escape;
});

