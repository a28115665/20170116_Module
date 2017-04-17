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
                    boolFilter: function (SysCodeFilter){
                        return SysCodeFilter.get('Boolean');
                    },
                    departFilter: function (SysCodeFilter){
                        return SysCodeFilter.get('Depart');
                    },
                    roleFilter: function (SysCodeFilter){
                        return SysCodeFilter.get('Role');
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
                templateUrl: 'app/Settings/views/account.html',
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
                    depart: function (SysCode){
                        return SysCode.get('Depart');
                    },
                    role : function (SysCode){
                        return SysCode.get('Role');
                    },
                    job : function (SysCode){
                        return SysCode.get('Job');
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
                templateUrl: 'app/Settings/views/group.html',
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
                    
                }
            }
        }
    })

});