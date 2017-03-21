"use strict";

angular.module('app.concerns', ['ui.router']);

angular.module('app.concerns').config(function ($stateProvider){

    $stateProvider
    .state('app.concerns', {
        abstract: true,
        data: {
            title: 'Concerns'
        }
    })

    .state('app.concerns.ban', {
        url: '/concerns/ban',
        data: {
            title: 'Ban'
        },
        views: {
            "content@app" : {
                templateUrl: 'app/Concerns/views/ban.html',
                controller: 'ConcernsBanCtrl',
                controllerAs: '$vm',
                resolve: {
                    billboardData: function () {
                        return [];
                    }
                }
            }
        }
    })

    .state('app.concerns.dailyalert', {
        url: '/concerns/dailyalert',
        data: {
            title: 'DailyAlert'
        },
        views: {
            "content@app" : {
                templateUrl: 'app/Concerns/views/dailyAlert.html',
                controller: 'ConcernsDailyAlertCtrl',
                controllerAs: '$vm',
                resolve: {
                    // billboardData: function () {
                    //     return [];
                    // }
                }
            }
        }
    })
})