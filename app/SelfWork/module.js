"use strict";

angular.module('app.selfwork', [
        'ui.router',
        'app.selfwork.leaderoption'
    ]);

angular.module('app.selfwork').config(function ($stateProvider){

    $stateProvider
    .state('app.selfwork', {
        abstract: true,
        data: {
            title: 'SelfWork'
        }
    })

    .state('app.selfwork.leaderjobs', {
        url: '/selfwork/leaderjobs',
        data: {
            title: 'LeaderJobs'
        },
        views: {
            "content@app" : {
                templateUrl: 'app/SelfWork/views/leaderJobs.html',
                controller: 'LeaderJobsCtrl',
                controllerAs: '$vm',
                resolve: {
                    userInfoByGrade : function(UserInfoByGrade, Session){
                        return UserInfoByGrade.get(Session.Get().U_ID, Session.Get().U_GRADE, Session.Get().DEPTS);
                    },
                    compy : function(Compy){
                        return Compy.get();
                    },
                    opType : function (SysCode){
                        return SysCode.get('OpType');
                    }
                }
            }
        }
    })

    .state('app.selfwork.leaderhistorysearch', {
        url: '/selfwork/leaderhistorysearch',
        data: {
            title: 'Leader History Search'
        },
        views: {
            "content@app" : {
                templateUrl: 'app/SelfWork/views/leaderHistorySearch.html',
                controller: 'LeaderHistorySearchCtrl',
                controllerAs: '$vm',
                resolve: {
                    
                }
            }
        }
    })

    .state('app.selfwork.assistantjobs', {
        url: '/selfwork/assistantjobs',
        data: {
            title: 'AssistantJobs'
        },
        views: {
            "content@app" : {
                templateUrl: 'app/SelfWork/views/assistantJobs.html',
                controller: 'AssistantJobsCtrl',
                controllerAs: '$vm',
                resolve: {
                    compy : function(Compy){
                        return Compy.get();
                    }
                }
            }
        }
    })

    .state('app.selfwork.assistantjobs.job002', {
        url: '/job002',
        data: {
            title: 'Job002'
        },
        params: { 
            data: null
        },
        parent: 'app.selfwork.assistantjobs',
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

    .state('app.selfwork.assistanthistorysearch', {
        url: '/selfwork/assistanthistorysearch',
        data: {
            title: 'Assistant History Search'
        },
        views: {
            "content@app" : {
                templateUrl: 'app/SelfWork/views/assistantHistorySearch.html',
                controller: 'AssistantHistorySearchCtrl',
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

    .state('app.selfwork.employeehistorysearch', {
        url: '/selfwork/employeehistorysearch',
        data: {
            title: 'Employee History Search'
        },
        views: {
            "content@app" : {
                templateUrl: 'app/SelfWork/views/employeeHistorySearch.html',
                controller: 'EmployeeHistorySearchCtrl',
                controllerAs: '$vm',
                resolve: {
                    
                }
            }
        }
    })

    .state('app.selfwork.deliveryjobs', {
        url: '/selfwork/deliveryjobs',
        data: {
            title: 'DeliveryJobs'
        },
        views: {
            "content@app" : {
                templateUrl: 'app/SelfWork/views/deliveryJobs.html',
                controller: 'DeliveryJobsCtrl',
                controllerAs: '$vm',
                resolve: {
                    compy: function(Compy){
                        return Compy.get();
                    }
                }
            }
        }
    })

    .state('app.selfwork.deliveryjobs.job003', {
        url: '/job003',
        data: {
            title: 'Job003'
        },
        params: { 
            data: null
        },
        parent: 'app.selfwork.deliveryjobs',
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

    .state('app.selfwork.deliveryhistorysearch', {
        url: '/selfwork/deliveryhistorysearch',
        data: {
            title: 'Delivery History Search'
        },
        views: {
            "content@app" : {
                templateUrl: 'app/SelfWork/views/deliveryHistorySearch.html',
                controller: 'DeliveryHistorySearchCtrl',
                controllerAs: '$vm',
                resolve: {
                    
                }
            }
        }
    })
});