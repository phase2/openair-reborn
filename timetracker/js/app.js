// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('timeTracker', ['ionic', 'timeTracker.controllers', 'timeTracker.services'])
//
//, 'timeTracker.services'

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    // setup an abstract state for the tabs directive
    .state('tab', {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html"
    })

    // the pet tab has its own child nav-view and history
    .state('tab.project-index', {
      url: '/tracker',
      views: {
        'project-tab': {
          templateUrl: 'templates/project-index.html',
          controller: 'ProjectIndexCtrl'
        }
      }
    })

    .state('tab.project-detail', {
      url: '/tracker/:trackerId',
      views: {
        'project-tab': {
          templateUrl: 'templates/project-detail.html',
          controller: 'ProjectDetailCtrl'
        }
      }
    })

     .state('tab.project-sub-detail', {
      url: '/tracker/:trackerId/:trackerSubId',
      views: {
        'project-tab': {
          templateUrl: 'templates/project-sub-detail.html',
          controller: 'ProjectSubDetailCtrl'
        }
      }
    })

    .state('tab.runningTimers', {
      url: '/runningTimers',
      views: {
        'runningTimers-tab': {
          templateUrl: 'templates/runningTimers.html',
          controller: 'runningTimerTab'
        }
      }
    })

    .state('tab.about', {
      url: '/about',
      views: {
        'about-tab': {
          templateUrl: 'templates/about.html'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/tracker');

});

