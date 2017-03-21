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
});