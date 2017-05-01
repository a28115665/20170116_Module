"use strict";

angular.module('app.settings', ['ui.router']);

angular.module('app.settings').config(function ($stateProvider){

	$stateProvider
    .state('app.settings', {
        abstract: true,
        data: {
            title: 'Settings'
        }
    })

	.state('app.settings.profile', {
		url: '/settings/profile',
        data: {
            title: 'Profile'
        },
		views: {
			"content@app" : {
				templateUrl: 'app/Settings/views/profile.html',
                controller: 'ProfileCtrl',
                controllerAs: '$vm',
                resolve: {
                }
			}
		}
	})

    .state('app.settings.accountmanagement', {
        url: '/settings/accountmanagement',
        data: {
            title: 'Account Management'
        },
        views: {
            "content@app" : {
                templateUrl: 'app/Settings/views/accountManagement.html',
                controller: 'AccountManagementCtrl',
                controllerAs: '$vm',
                resolve: {
                    // Grid的篩選條件
                    boolFilter: function (SysCodeFilter){
                        return SysCodeFilter.get('Boolean');
                    },
                    departFilter: function (SysCodeFilter){
                        return SysCodeFilter.get('Depart');
                    },
                    roleFilter: function (SysCodeFilter){
                        return SysCodeFilter.get('Role');
                    },
                    gradeFilter: function (UserGradeFilter){
                        return UserGradeFilter.get();
                    }
                }
            }
        }
    })

    .state('app.settings.accountmanagement.account', {
        url: '/account',
        data: {
            title: 'Account'
        },
        params: { 
            data: null
        },
        views: {
            "content@app" : {
                templateUrl: 'app/Settings/views/accountmanagement/account.html',
                controller: 'AccountCtrl',
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
                    depart: function (RestfulApi, $q){

                        var deferred = $q.defer();
            
                        RestfulApi.SearchMSSQLData({
                            querymain: 'account',
                            queryname: 'SelectSysUserDept',
                            params: {
                                SUD_STS : false
                            }
                        }).then(function (res){
                            var data = res["returnData"] || [],
                                finalData = {};

                            for(var i in data){
                                finalData[data[i].SUD_DEPT] = data[i].SUD_NAME
                            }
                            
                            deferred.resolve(finalData);
                        }, function (err){
                            deferred.reject({});
                        });
                        
                        return deferred.promise;
                    },
                    role : function (SysCode){
                        return SysCode.get('Role');
                    },
                    grade : function (UserGrade){
                        return UserGrade.get();
                    }
                }
            }
        }
    })

    .state('app.settings.accountmanagement.group', {
        url: '/group',
        data: {
            title: 'Group'
        },
        params: { 
            data: null
        },
        views: {
            "content@app" : {
                templateUrl: 'app/Settings/views/accountmanagement/group.html',
                controller: 'GroupCtrl',
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
                    }
                }
            }
        }
    })

    .state('app.settings.billboardeditor', {
        url: '/settings/billboardeditor',
        data: {
            title: 'Billboard Editor'
        },
        views: {
            "content@app" : {
                templateUrl: 'app/Settings/views/billboardEditor.html',
                controller: 'BillboardEditorCtrl',
                controllerAs: '$vm',
                resolve: {
                    boolFilter: function (SysCodeFilter){
                        return SysCodeFilter.get('Boolean');
                    },
                    ioTypeFilter: function (SysCodeFilter){
                        return SysCodeFilter.get('IOType');
                    }
                }
            }
        }
    })

    .state('app.settings.billboardeditor.news', {
        url: '/news',
        data: {
            title: 'Add News'
        },
        params: { 
            data: null
        },
        views: {
            "content@app" : {
                templateUrl: 'app/Settings/views/news.html',
                controller: 'NewsCtrl',
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
                    ioType: function (SysCode){
                        return SysCode.get('IOType');
                    }
                }
            }
        }
    })

    .state('app.settings.externalmanagement', {
        url: '/settings/externalmanagement',
        data: {
            title: 'External Management'
        },
        views: {
            "content@app" : {
                templateUrl: 'app/Settings/views/externalManagement.html',
                controller: 'ExternalManagementCtrl',
                controllerAs: '$vm',
                resolve: {
                    boolFilter: function (SysCodeFilter){
                        return SysCodeFilter.get('Boolean');
                    },
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

    .state('app.settings.externalmanagement.exaccount', {
        url: '/exaccount',
        data: {
            title: 'ExAccount'
        },
        params: { 
            data: null
        },
        views: {
            "content@app" : {
                templateUrl: 'app/Settings/views/externalManagement/exAccount.html',
                controller: 'ExAccountCtrl',
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
                    compy: function(RestfulApi, $q){

                        var deferred = $q.defer();

                        RestfulApi.SearchMSSQLData({
                            querymain: 'externalManagement',
                            queryname: 'SelectCompyInfo',
                            params: {
                                CO_STS : false
                            }
                        }).then(function (res){
                            var data = res["returnData"],
                                finalData = [];

                            for(var i in data){
                                // console.log(data[i]);
                                var _name = data[i].CO_NAME == null ? '' : data[i].CO_NAME,
                                    _addr = data[i].CO_ADDR == null ? '' : data[i].CO_ADDR;
                                finalData.push({
                                    value: data[i].CO_CODE, 
                                    key: _name + ' - ' + _addr
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

    .state('app.settings.externalmanagement.excompy', {
        url: '/excompy',
        data: {
            title: 'ExCompy'
        },
        params: { 
            data: null
        },
        views: {
            "content@app" : {
                templateUrl: 'app/Settings/views/externalManagement/exCompy.html',
                controller: 'ExCompyCtrl',
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
                    }
                }
            }
        }
    })

});