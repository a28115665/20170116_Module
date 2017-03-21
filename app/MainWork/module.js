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
                            queryname: 'SelectAllBillboard'
                        }).then(function (res){
                            var data = res.data["returnData"] || [],
                                finalData = [];

                            for(var i in data){
                                finalData.push({
                                    BB_IsTop    : data[i]['BB_IsTop'],
                                    BB_PostTime    : data[i]['BB_PostTime'],
                                    BB_Title  : data[i]['BB_Title'],
                                    BB_Content : data[i]['BB_Content'],
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