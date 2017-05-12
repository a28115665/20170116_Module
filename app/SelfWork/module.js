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
                        return UserInfoByGrade.get(Session.Get().U_ID, Session.Get().U_GRADE, Session.Get().DEPTS);
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
                    userInfoByCompyDistribution : function (UserInfoByCompyDistribution, Session){
                        return UserInfoByCompyDistribution.get(Session.Get().U_ID);
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
                    userInfoByGrade : function(UserInfoByGrade, Session){
                        return UserInfoByGrade.get(Session.Get().U_ID, Session.Get().U_GRADE, Session.Get().DEPTS);
                    },
                    bool : function(SysCode){
                        return SysCode.get('Boolean');
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
                    userInfoByGrade : function(UserInfoByGrade, Session){
                        return UserInfoByGrade.get(Session.Get().U_ID, Session.Get().U_GRADE, Session.Get().DEPTS);
                    },
                    compy : function(Compy){
                        return Compy.get();
                    }
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
                    compy: function(Compy){
                        return Compy.get();
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