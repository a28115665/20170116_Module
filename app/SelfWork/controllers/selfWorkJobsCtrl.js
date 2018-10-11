"use strict";

angular.module('app.selfwork').controller('SelfWorkJobsCtrl', function ($scope, $stateParams, $state, AuthApi, Session, toaster, $uibModal, $templateCache) {
    
    var $vm = this;

	angular.extend(this, {
        profile : Session.Get(),
        searchCondition : {
        	a : ['297-64659291', '297-64659292'],
        	b : ['CI5822'],
            c : ['HK'],
            d : ['新桥供应链'],
            e : ['0A4JV163', '0A4JV164', '0A4JV165'],
            f : ['9577943035', '9577943094', '9577942883']
        },
        defaultChoice : 'Left',
        gridMethod : {
            //退件
            rejectData : function(row){
                console.log(row);
            },
            //編輯
            modifyData : function(row){
                console.log(row);
                $state.transitionTo("app.selfwork.jobs.editorjob", {
                    data: {
                      id: 5,
                      blue: '#0000FF'
                    }
                });
            },
            //結單
            closeData : function(row){
                console.log(row);
            }
        },
        selfOrderOptions : {
            data:  [
                {
                    a : '2017-02-09',
                    b : '297-64659291',
                    c : '2017-01-15',
                    d : 'CI5822',
                    e : 'HK',
                    f : '新桥供应链',
                    g : true
                },
                {
                    a : '2017-02-09',
                    b : '297-64659292',
                    c : '2017-01-15',
                    d : 'CI5822',
                    e : 'HK',
                    f : '新桥供应链',
                    g : false
                },
            ],
            columnDefs: [
                { name: 'a',        displayName: '提單日期' },
                { name: 'b',        displayName: '主號' },
                { name: 'c',        displayName: '進口日期' },
                { name: 'd',        displayName: '班機' },
                { name: 'e',        displayName: '啟運國別' },
                { name: 'f',        displayName: '寄件人或公司' },
                { name: 'g',        displayName: '狀態', cellTemplate: $templateCache.get('accessibilityLightStatus') },
                { name: 'Options',  displayName: '操作', cellTemplate: $templateCache.get('accessibilityToDMC') }
            ],
            enableFiltering: false,
            enableSorting: false,
            enableColumnMenus: false,
            // enableVerticalScrollbar: false,
            paginationPageSizes: [10, 25, 50],
            paginationPageSize: 10
        }
    });

})