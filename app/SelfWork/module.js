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

    .state('app.selfwork.employeejobs', {
        url: '/selfwork/employeejobs',
        data: {
            title: 'EmployeeJobs'
        },
        views: {
            "content@app" : {
                templateUrl: 'app/SelfWork/views/employeeJobs.html',
                controller: 'EmployeeJobsCtrl',
                controllerAs: '$vm',
                resolve: {
                    compyFilter: function(RestfulApi, $q){

                        var deferred = $q.defer();

                        RestfulApi.SearchMSSQLData({
                            querymain: 'externalManagement',
                            queryname: 'SelectCompyInfo',
                            params: {
                                CO_STS : false
                            }
                        }).then(function (res){
                            var data = res["returnData"] || [],
                                finalData = [];

                            for(var i in data){
                                finalData.push({
                                    value: data[i].CO_CODE,
                                    label: data[i].CO_NAME == null ? '' : data[i].CO_NAME
                                });
                            }

                            deferred.resolve(finalData);
                        })

                        return deferred.promise;
                    }
                }
            }
        }
    })

    .state('app.selfwork.employeejobs.job001', {
        url: '/job001',
        data: {
            title: 'Job001'
        },
        params: { 
            data: null
        },
        parent: 'app.selfwork.employeejobs',
        views: {
            "content@app" : {
                templateUrl: 'app/SelfWork/views/jobs/job001.html',
                controller: 'Job001Ctrl',
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
})