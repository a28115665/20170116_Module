"use strict";


angular.module('app.layout', ['ui.router'])

.config(function ($stateProvider, $urlRouterProvider) {


    $stateProvider
        .state('app', {
            abstract: true,
            views: {
                root: {
                    templateUrl: 'app/layout/layout.tpl.html',
                    controller: function ($rootScope, $stateParams, $state, i18nService) {
                        i18nService.setCurrentLang('zh-tw');
                    }
                }
            }
        });
    $urlRouterProvider.otherwise('/mainwork');

})

