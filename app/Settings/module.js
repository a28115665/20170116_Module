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
                    // config: function (RestfulApi) {
                    // 	/**
                    // 	 * Select Sample
                    // 	 */
                    //     return RestfulApi.SearchMSSQLData({
                    //         queryname: 'SelectAllUserInfo',
	                   //      params: {
	                   //          U_ID : "Admin",
	                   //          U_Name : "系統管理員"
	                   //      }
                    //     });
                    // }
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
                    account: function (Account){
                        return Account;
                    },
                    role: function (Role){
                        return Role;
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
                    bool: function (Bool){
                        return Bool;
                    },
                    ioType: function (IOType){
                        return IOType;
                    }
                }
            }
        }
    })
});