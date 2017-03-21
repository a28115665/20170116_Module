"use strict";

angular.module('app.restful', ['ui.router']);

angular.module('app.restful').config(function ($stateProvider){

	$stateProvider
        .state('app.restful', {
            abstract: true,
            data: {
                title: 'Restful'
            }
        })

		.state('app.restful.alantest', {
			url: '/alantest',
            data: {
                title: 'AlanTest'
            },
			views: {
				"content@app" : {
					templateUrl: 'app/Restful/views/test.html',
                    controller: function ($scope, config, RestfulApi) {
                    	// var self = {};
                    	this.data = config.data["returnData"];
                    	console.log(config);

                        /**
                         * Insert Sample
                         */
                        // RestfulApi.InsertMSSQLData({
                        //     insertname: 'Insert',
                        //     table: 0,
                        //     params: {
                        //         U_ID : "ttt",
                        //         U_Name : "aaa"
                        //     }
                        // }).then(function(res) {
                        //     console.log(res);
                        // });

                        /**
                         * Update Sample
                         */
                        // RestfulApi.UpdateMSSQLData({
                        //     updatename: 'Update',
                        //     table: 0,
                        //     params: {
                        //         U_Name : "gggg"
                        //     },
                        //     condition: {
                        //         U_ID : "ttt"
                        //     }
                        // }).then(function(res) {
                        //     console.log(res);
                        // });

                        /**
                         * Delete Sample
                         */
                        // RestfulApi.DeleteMSSQLData({
                        //     deletename: 'Delete',
                        //     table: 0,
                        //     params: {
                        //         U_ID : "ttt"
                        //     }
                        // }).then(function(res) {
                        //     console.log(res);
                        // });
                    },
                    controllerAs: 'alanTestCtrl',
                    resolve: {
                        config: function (RestfulApi) {
                        	/**
                        	 * Select Sample
                        	 */
                            return RestfulApi.SearchMSSQLData({
                                queryname: 'SelectAllUserInfo',
		                        params: {
		                            U_ID : "Admin",
		                            U_Name : "系統管理員"
		                        }
                            });
                        }
                    }
				}
			}
		})

		.state('app.restful.gridtest', {
			url: '/gridtest',
            data: {
                title: 'GridTest'
            },
			views: {
				"content@app" : {
					templateUrl: 'app/Restful/views/grid.html',
                    controller: function ($scope, RestfulApi) {
                    	this.gridOpts = {
							columnDefs: [
								{ name: 'firstName' },
							    { name: 'lastName' },
							    { name: 'company' },
							    { name: 'gender' }
							],
							data: [
								{
								  "firstName": "Cox",
								  "lastName": "Carney",
								  "company": "Enormo",
								  "gender": "male"
								},
								{
								  "firstName": "Lorraine",
								  "lastName": "Wise",
								  "company": "Comveyer",
								  "gender": "female"
								},
								{
								  "firstName": "Nancy",
								  "lastName": "Waters",
								  "company": "Fuelton",
								  "gender": "female"
								},
								{
								  "firstName": "Misty",
								  "lastName": "Oneill",
								  "company": "Letpro",
								  "gender": "female"
								}
							]
						};
                    },
                    controllerAs: 'gtVM',
                    // resolve: {
                    //     config: function (RestfulApi) {
                    //     	/**
                    //     	 * Select Sample
                    //     	 */
                    //         return RestfulApi.SearchMSSQLData({
                    //             queryname: 'SelectAllUserInfo',
		                  //       params: {
		                  //           U_ID : "Admin",
		                  //           U_Name : "系統管理員"
		                  //       }
                    //         });
                    //     }
                    // }
				}
			}
		})
})