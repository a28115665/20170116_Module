"use strict";

angular.module('app.mainwork', ['ui.router']);

angular.module('app.mainwork').config(function ($stateProvider){

    $stateProvider
    // .state('app.mainwork', {
    //     abstract: true,
    //     data: {
    //         title: 'Mainwork'
    //     }
    // })

    .state('app.mainwork', {
        url: '/mainwork',
        data: {
            title: 'MainWork'
        },
        views: {
            "content@app" : {
                templateUrl: 'app/MainWork/views/main.html',
                controller: 'MainWorkCtrl',
                controllerAs: '$vm',
                resolve: {
                    billboardData: function (RestfulApi, $q) {
                        var deferred = $q.defer();

                        RestfulApi.SearchMSSQLData({
                            querymain: 'main',
                            queryname: 'SelectAllBillboard'
                        }).then(function (res){
                            var data = res["returnData"] || [],
                                finalData = [];

                            for(var i in data){
                                finalData.push({
                                    BB_STICK_TOP    : data[i]['BB_STICK_TOP'],
                                    BB_POST_FROM    : data[i]['BB_POST_FROM'],
                                    BB_TITLE  : data[i]['BB_TITLE'],
                                    BB_CONTENT : data[i]['BB_CONTENT'],
                                    BB_CR_Name  : data[i]['BB_CR_Name']
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
})