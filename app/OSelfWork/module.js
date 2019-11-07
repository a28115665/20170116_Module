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

    .state('app.oselfwork.oleaderjobs', {
        url: '/oselfwork/oleaderjobs',
        data: {
            title: 'OLeaderJobs'
        },
        views: {
            "content@app" : {
                templateUrl: 'app/OSelfWork/views/oleaderJobs.html',
                controller: 'OLeaderJobsCtrl',
                controllerAs: '$vm',
                resolve: {
                    userInfoByGrade : function(UserInfoByGrade, Session){
                        console.log("Session:", Session.Get());
                        return UserInfoByGrade.get(Session.Get().U_ID, Session.Get().U_GRADE, Session.Get().DEPTS);
                    },
                    ocompy : function(OCompy){
                        return OCompy.get();
                    },
                    opType : function (SysCode){
                        return SysCode.get('OpType');
                    }
                }
            }
        }
    })

    .state('app.oselfwork.oleaderhistorysearch', {
        url: '/oselfwork/oleaderhistorysearch',
        data: {
            title: 'OLeaderHistorySearch'
        },
        views: {
            "content@app" : {
                templateUrl: 'app/OSelfWork/views/oleaderHistorySearch.html',
                controller: 'OLeaderHistorySearchCtrl',
                controllerAs: '$vm',
                resolve: {
                    ocompy : function(OCompy){
                        return OCompy.get();
                    },
                    bool: function (SysCode){
                        return SysCode.get('Boolean');
                    },
                    userInfo: function(UserInfo){
                        return UserInfo.get();
                    }
                }
            }
        }
    })

    .state('app.oselfwork.oemployeejobs', {
        url: '/oselfwork/oemployeejobs',
        data: {
            title: 'OEmployeeJobs'
        },
        views: {
            "content@app" : {
                templateUrl: 'app/OSelfWork/views/oemployeeJobs.html',
                controller: 'OEmployeeJobsCtrl',
                controllerAs: '$vm',
                resolve: {
                    ocompy: function(OCompy){
                        return OCompy.get();
                    },
                    userInfo: function(UserInfo){
                        return UserInfo.get();
                    }
                }
            }
        }
    })

    .state('app.oselfwork.oemployeejobs.ojob001', {
        url: '/ojob001',
        data: {
            title: 'OJob001'
        },
        params: { 
            data: null
        },
        parent: 'app.oselfwork.oemployeejobs',
        views: {
            "content@app" : {
                templateUrl: 'app/OSelfWork/views/jobs/ojob001.html',
                controller: 'OJob001Ctrl',
                controllerAs: '$vm',
                resolve: {
                    bool: function (SysCode){
                        return SysCode.get('Boolean');
                    }
                }
            }
        }
    })


});