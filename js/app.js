'use strict';

angular.module('app', ['app.controllers', 'app.directives']).config(function ($locationProvider) {
  $locationProvider.html5Mode(true);
});