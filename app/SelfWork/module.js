"use strict";

angular.module('app.selfwork', ['ui.router']);

angular.module('app.selfwork').config(function ($stateProvider){

    $stateProvider
    .state('app.selfwork', {
        abstract: true,
        data: {
            title: 'SelfWork'
        }
    })

    .state('app.selfwork.jobs', {
        url: '/selfwork/jobs',
        data: {
            title: 'Jobs'
        },
        views: {
            "content@app" : {
                templateUrl: 'app/SelfWork/views/jobs.html',
                controller: 'SelfWorkJobsCtrl',
                controllerAs: '$vm',
                resolve: {
                    billboardData: function () {
                        return [];
                    }
                }
            }
        }
    })

    .state('app.selfwork.historysearch', {
        url: '/selfwork/historysearch',
        data: {
            title: 'HistorySearch'
        },
        views: {
            "content@app" : {
                templateUrl: 'app/SelfWork/views/historySearch.html',
                controller: 'SelfWorkHistorySearchCtrl',
                controllerAs: '$vm',
                resolve: {
                    billboardData: function () {
                        return [];
                    }
                }
            }
        }
    })

    .state('app.selfwork.jobs.editorjob', {
        url: '/editorjob',
        data: {
            title: 'EditorJob'
        },
        params: { 
        	data: null
        },
        parent: 'app.selfwork.jobs',
        views: {
            "content@app" : {
                templateUrl: 'app/SelfWork/views/editorJob.html',
                controller: 'SelfWorkEditorJobCtrl',
                controllerAs: '$vm',
                resolve: {
                    billboardData: function () {
                        return [];
                    }
                }
            }
        }
    })
})