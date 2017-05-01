"use strict";

angular.module('app.concerns', ['ui.router']);

angular.module('app.concerns').config(function ($stateProvider){

    $stateProvider
    .state('app.concerns', {
        abstract: true,
        data: {
            title: 'Concerns'
        }
    })

    .state('app.concerns.ban', {
        url: '/concerns/ban',
        data: {
            title: 'Ban'
        },
        views: {
            "content@app" : {
                templateUrl: 'app/Concerns/views/ban.html',
                controller: 'BanCtrl',
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
                    boolFilter: function (SysCodeFilter){
                        return SysCodeFilter.get('Boolean');
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
                                    // value: data[i].CO_CODE, 
                                    // 因Table存字串，所以用name
                                    value: _name,
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

    .state('app.concerns.dailyalert', {
        url: '/concerns/dailyalert',
        data: {
            title: 'DailyAlert'
        },
        views: {
            "content@app" : {
                templateUrl: 'app/Concerns/views/dailyAlert.html',
                controller: 'DailyAlertCtrl',
                controllerAs: '$vm',
                resolve: {
                    
                }
            }
        }
    })
})