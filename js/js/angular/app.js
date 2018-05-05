angular.module('app', ['ui-notification', 'ngSanitize', 'angular-bind-html-compile']); //Notificaciones tipo Bootstrap
var app = angular.module('app');

//Asignar foco con angular
app.directive('focusMe', function($timeout) {
    return {
      scope: { trigger: '=focusMe' },
      link: function(scope, element) {
        scope.$watch('trigger', function(value) {
          if(value === true) { 
              element[0].focus();
              scope.trigger = false;
          }
        });
      }
    };
  });