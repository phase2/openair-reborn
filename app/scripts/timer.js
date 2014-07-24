/*jshint ignore: start*/

/**
 * Hacked version of https://github.com/siddii/angular-timer v1.1.6
 *
 * Had to hack it to make it support passing in a pre-passed time duration
 * instead of a original start time, which made things a lot more complicated.
 * Also removed a lot of stuff we don't need, such as countdowns and end times.
 */
var timerModule = angular.module('timer', [])
    .directive('timer', ['$compile', function ($compile) {
        return  {
            restrict: 'EAC',
            replace: false,
            scope: {
                interval: '=interval',
                startTimeAttr: '=startTime',
                autoStart: '&autoStart',
                maxTimeUnit: '='
            },
            controller: ['$scope', '$element', '$attrs', '$timeout', function ($scope, $element, $attrs, $timeout) {

                //angular 1.2 doesn't support attributes ending in "-start", so we're
                //supporting both "autostart" and "auto-start" as a solution for
                //backward and forward compatibility.
                $scope.autoStart = $attrs.autoStart || $attrs.autostart;

                if ($element.html().trim().length > 0) {
                    $element.append($compile($element.contents())($scope));
                }

                $scope.startTime = $scope.startTimeAttr ? $scope.startTimeAttr : 0;

                $scope.startTime = null;
                $scope.timeoutId = null;
                $scope.isRunning = false;

                $scope.$on('timer-start', function () {
                    $scope.start();
                });

                $scope.$on('timer-resume', function () {
                    $scope.resume();
                });

                $scope.$on('timer-stop', function () {
                    $scope.stop();
                });

                $scope.$on('timer-clear', function () {
                    $scope.clear();
                });

                function resetTimeout() {
                    if ($scope.timeoutId) {
                        clearTimeout($scope.timeoutId);
                    }
                }

                $scope.start = $element[0].start = function () {
                    $scope.startTime = $scope.startTimeAttr ? $scope.startTimeAttr : 0;
                    resetTimeout();
                    tick($element);
                    $scope.isRunning = true;
                };

                $scope.resume = $element[0].resume = function () {
                    resetTimeout();
                    $scope.startTime = $scope.stoppedTime;
                    tick($element);
                    $scope.isRunning = true;
                };

                $scope.stop = $scope.pause = $element[0].stop = $element[0].pause = function () {
                    var timeoutId = $scope.timeoutId;
                    $scope.clear();
                    $scope.$emit('timer-stopped', {timeoutId: timeoutId, millis: $scope.millis, seconds: $scope.seconds, minutes: $scope.minutes, hours: $scope.hours, days: $scope.days});
                };

                $scope.clear = $element[0].clear = function () {
                    // same as stop but without the event being triggered
                    $scope.stoppedTime = $scope.startTime;
                    resetTimeout();
                    $scope.timeoutId = null;
                    $scope.isRunning = false;
                };

                $element.bind('$destroy', function () {
                    resetTimeout();
                    $scope.isRunning = false;
                });

                function calculateTimeUnits() {
                    $scope.seconds = Math.floor(($scope.startTime / 1000) % 60);
                    $scope.minutes = Math.floor((($scope.startTime / (60000)) % 60));
                    $scope.hours = Math.floor($scope.startTime / 3600000);
                    $scope.days = 0;
                    $scope.months = 0;
                    $scope.years = 0;
                    $scope.millis = $scope.startTime;

                    //add leading zero if number is smaller than 10
                    $scope.sseconds = $scope.seconds < 10 ? '0' + $scope.seconds : $scope.seconds;
                    $scope.mminutes = $scope.minutes < 10 ? '0' + $scope.minutes : $scope.minutes;
                    $scope.hhours = $scope.hours < 10 ? '0' + $scope.hours : $scope.hours;
                    $scope.ddays = $scope.days < 10 ? '0' + $scope.days : $scope.days;
                    $scope.mmonths = $scope.months < 10 ? '0' + $scope.months : $scope.months;
                    $scope.yyears = $scope.years < 10 ? '0' + $scope.years : $scope.years;

                }

                //determine initial values of time units and add AddSeconds functionality
                calculateTimeUnits();

                var tick = function ($element) {

                    $scope.startTime += 1000;

                    calculateTimeUnits();

                    //We are not using $timeout for a reason. Please read here - https://github.com/siddii/angular-timer/pull/5
                    $scope.timeoutId = setTimeout(function () {
                        tick($element);
                        $scope.$digest();
                    }, 1000);

                    var className = $element.parents('tr').attr('class').split(' ')[0];
                    var cellId = className.split('-')[1];

                    $scope.$emit('timer-tick', {cellId: cellId, millis: $scope.startTime});
                };

                if ($scope.autoStart === undefined || $scope.autoStart === true) {
                    $scope.start();
                } else {
                    $scope.startTime = $scope.startTimeAttr ? $scope.startTimeAttr : 0;
                    calculateTimeUnits();
                }
            }]
        };
    }]);
