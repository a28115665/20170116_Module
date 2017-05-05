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

    .state('app.selfwork.compydistribution', {
        url: '/selfwork/compydistribution',
        data: {
            title: 'CompyDistribution'
        },
        views: {
            "content@app" : {
                templateUrl: 'app/SelfWork/views/leaderOption/compyDistribution.html',
                controller: 'CompyDistributionCtrl',
                controllerAs: '$vm',
                resolve: {
                    userInfoByGrade : function(UserInfoByGrade, Session){
                        return UserInfoByGrade.get(Session.Get().U_ID, Session.Get().U_GRADE);
                    },
                    userInfoByGradeFilter : function(UserInfoByGradeFilter, Session){
                        return UserInfoByGradeFilter.get(Session.Get().U_ID, Session.Get().U_GRADE);
                    }
                }
            }
        }
    })

    .state('app.selfwork.agentsetting', {
        url: '/selfwork/agentsetting',
        data: {
            title: 'AgentSetting'
        },
        views: {
            "content@app" : {
                templateUrl: 'app/SelfWork/views/leaderOption/agentSetting.html',
                controller: 'AgentSettingCtrl',
                controllerAs: '$vm',
                resolve: {
                    userInfoByCompyDistribution : function (RestfulApi, $q, Session){

                        var deferred = $q.defer();
            
                        RestfulApi.SearchMSSQLData({
                            querymain: 'agentSetting',
                            queryname: 'SelectUserInfoByCompyDistribution',
                            params: {
                                COD_CR_USER : Session.Get().U_ID
                            }
                        }).then(function (res){
                            var data = res["returnData"] || [],
                                finalData = {};

                            for(var i in data){
                                finalData[data[i].COD_PRINCIPAL] = data[i].U_NAME
                            }
                            
                            deferred.resolve(finalData);
                        }, function (err){
                            deferred.reject({});
                        });
                        
                        return deferred.promise;
                    },
                    userInfoByCompyDistributionFilter : function (RestfulApi, $q, Session){

                        var deferred = $q.defer();
            
                        RestfulApi.SearchMSSQLData({
                            querymain: 'agentSetting',
                            queryname: 'SelectUserInfoByCompyDistribution',
                            params: {
                                COD_CR_USER : Session.Get().U_ID
                            }
                        }).then(function (res){
                            var data = res["returnData"] || [],
                                finalData = [];

                            for(var i in data){
                                finalData.push({
                                    value: data[i].COD_PRINCIPAL,
                                    label: data[i].U_NAME
                                });
                            }

                            deferred.resolve(finalData);
                        }, function (err){
                            deferred.reject({});
                        });
                        
                        return deferred.promise;
                    },
                    userInfoByGradeFilter : function(UserInfoByGradeFilter, Session){
                        return UserInfoByGradeFilter.get(Session.Get().U_ID, Session.Get().U_GRADE);
                    }
                }
            }
        }
    })

    .state('app.selfwork.dailyleave', {
        url: '/selfwork/dailyleave',
        data: {
            title: 'DailyLeave'
        },
        views: {
            "content@app" : {
                templateUrl: 'app/SelfWork/views/leaderOption/dailyleave.html',
                controller: 'DailyLeaveCtrl',
                controllerAs: '$vm',
                resolve: {
                    bool: function (SysCode, $q){

                        var deferred = $q.defer();

                        SysCode.get('Boolean').then(function (res){
                            var finalData = [];

                            for(var i in res){
                                finalData.push({
                                    value: (i == 'true'), 
                                    key: res[i]
                                });
                            }

                            deferred.resolve(finalData);
                        });

                        return deferred.promise;
                    },
                    boolFilter : function(SysCodeFilter){
                        return SysCodeFilter.get('Boolean');
                    }
                }
            }
        }
    })

    .state('app.selfwork.leaderjobs', {
        url: '/selfwork/leaderjobs',
        data: {
            title: 'LeaderJobs'
        },
        views: {
            "content@app" : {
                templateUrl: 'app/SelfWork/views/LeaderJobs.html',
                controller: 'LeaderJobsCtrl',
                controllerAs: '$vm',
                resolve: {
                    
                }
            }
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

                }
            }
        }
    })

    .state('app.selfwork.employeejobs.job002', {
        url: '/job002',
        data: {
            title: 'Job002'
        },
        params: { 
            data: null
        },
        parent: 'app.selfwork.employeejobs',
        views: {
            "content@app" : {
                templateUrl: 'app/SelfWork/views/jobs/job002.html',
                controller: 'Job002Ctrl',
                controllerAs: '$vm',
                resolve: {

                }
            }
        }
    })

    .state('app.selfwork.employeejobs.job003', {
        url: '/job003',
        data: {
            title: 'Job003'
        },
        params: { 
            data: null
        },
        parent: 'app.selfwork.employeejobs',
        views: {
            "content@app" : {
                templateUrl: 'app/SelfWork/views/jobs/job003.html',
                controller: 'Job003Ctrl',
                controllerAs: '$vm',
                resolve: {

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