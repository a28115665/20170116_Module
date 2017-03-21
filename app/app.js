'use strict';

/**
 * @ngdoc overview
 * @name app [smartadminApp]
 * @description
 * # app [smartadminApp]
 *
 * Main module of the application.
 */

angular.module('app', [
    'ngSanitize',
    'ngAnimate',
    'ngResource',
    'restangular',
    'ui.router',
    'ui.bootstrap',
    'toaster',
    'ui.grid',
    'ui.grid.resizeColumns',
    'ui.grid.edit',
    'ui.grid.rowEdit',
    'ui.grid.selection',
    'ui.grid.exporter',
    'ui.grid.pagination',
    'ui.grid.treeView',
    'ui.grid.pinning',

    // Smartadmin Angular Common Module
    'SmartAdmin',

    // App
    'app.auth',
    'app.layout',
    'app.chat',
    'app.dashboard',
    'app.calendar',
    'app.inbox',
    'app.graphs',
    'app.tables',
    'app.forms',
    'app.ui',
    'app.widgets',
    'app.maps',
    'app.appViews',
    'app.misc',
    'app.smartAdmin',
    'app.eCommerce',

    // Project
    'app.restful',
    'app.mainwork',
    'app.selfwork',
    'app.concerns',
    'app.settings'
])
.config(function ($provide, $httpProvider, RestangularProvider) {


    // Intercept http calls.
    $provide.factory('ErrorHttpInterceptor', function ($q, toaster) {
        var errorCounter = 0;

        function notifyError(rejection) {
            console.log(rejection);
            // $.bigBox({
            //     title: rejection.status + ' ' + rejection.statusText,
            //     content: rejection.data,
            //     color: "#C46A69",
            //     icon: "fa fa-warning shake animated",
            //     number: ++errorCounter,
            //     timeout: 6000
            // });
            toaster.error(rejection.status + ' ' + rejection.statusText, rejection.data, 6000);
        }

        return {
            // On request failure
            requestError: function(rejection) {
                // show notification
                notifyError(rejection);

                // Return the promise rejection.
                return $q.reject(rejection);
            },

            // On response failure
            responseError: function(rejection) {
                // show notification
                notifyError(rejection);
                // Return the promise rejection.
                return $q.reject(rejection);
            }
        };
    });

    // Add the interceptor to the $httpProvider.
    $httpProvider.interceptors.push('ErrorHttpInterceptor');

    RestangularProvider.setBaseUrl(location.pathname.replace(/[^\/]+?$/, ''));

})
.constant('APP_CONFIG', window.appConfig)

.run(function ($rootScope, $state, $stateParams, Session, $http) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    // editableOptions.theme = 'bs3';
    
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        // track the state the user wants to go to; 
        // authorization service needs this

        console.log(toState, toParams, fromState, fromParams);
        $http.get('auth/reLoadSession')
        .success(function(data, status, headers, config) {
            // console.log(data, status, headers, config);
            if(status == 200 && data != ""){
                Session.Set(data);
                switch(toState.name){
                    // block some key url.
                    case "app.selfwork.jobs.editorjob":
                        // if(!angular.isObject(toParams['data'])){
                        //     $state.transitionTo("app.selfwork.jobs");
                        // }
                        break;
                }
            }else{
                Session.Destroy();
                switch(toState.name){
                    case "login":
                    case "register":
                    case "forgotPassword":
                        $state.transitionTo(toState.name);
                        break;
                    default:
                        $state.transitionTo("login");
                }
            }
            event.preventDefault(); 
        })
        .error(function(data, status, headers, config) {
            $state.transitionTo("login");
            event.preventDefault(); 
        });
    });

});
