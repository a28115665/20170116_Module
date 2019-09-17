"use strict";

angular.module('app.oselfwork', [
        'ui.router',
        'app.oselfwork.oleaderoption'
    ]);

angular.module('app.oselfwork').config(function ($stateProvider){

    $stateProvider
    .state('app.oselfwork', {
        abstract: true,
        data: {
            title: 'OSelfWork'
        }
    })


});