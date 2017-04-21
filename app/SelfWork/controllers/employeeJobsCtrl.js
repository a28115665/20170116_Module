"use strict";

angular.module('app.selfwork').controller('EmployeeJobsCtrl', function ($scope, $stateParams, $state, AuthApi, Session, toaster, $uibModal, $templateCache, uiGridConstants, RestfulApi, compyFilter) {
    
    var $vm = this;

	angular.extend(this, {
        Init : function(){
            LoadOrderList();
        },
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
                $state.transitionTo("app.selfwork.employeejobs.job001", {
                    data: row.entity
                });
            },
            //結單
            closeData : function(row){
                console.log(row);
            }
        },
        orderListOptions : {
            data:  '$vm.selfWorkData',
            columnDefs: [
                // { name: 'a',        displayName: '提單日期' },
                { name: 'OL_MASTER'   ,  displayName: '主號' },
                { name: 'OL_IMPORTDT' ,  displayName: '進口日期', cellFilter: 'dateFilter' },
                { name: 'OL_FLIGHTNO' ,  displayName: '航班' },
                { name: 'OL_COUNTRY'  ,  displayName: '起運國別' },
                { name: 'OL_CO_CODE'  ,  displayName: '寄件人或公司', cellFilter: 'compyFilter', filter: 
                    {
                        term: null,
                        type: uiGridConstants.filter.SELECT,
                        selectOptions: compyFilter
                    }
                },
                // { name: 'g',        displayName: '狀態', cellTemplate: $templateCache.get('accessibilityLightStatus') },
                { name: 'ITEM_LIST'          ,  displayName: '報機單', enableFiltering: false, cellTemplate: $templateCache.get('accessibilityToDMC') },
                { name: 'FLIGHT_ITEM_LIST'   ,  displayName: '銷艙單', enableFiltering: false, cellTemplate: $templateCache.get('accessibilityToDMC') },
                { name: 'DELIVERY_ITEM_LIST' ,  displayName: '派送單', enableFiltering: false, cellTemplate: $templateCache.get('accessibilityToDMC') }
            ],
            enableFiltering: true,
            enableSorting: false,
            enableColumnMenus: false,
            // enableVerticalScrollbar: false,
            paginationPageSizes: [10, 25, 50],
            paginationPageSize: 10,
            onRegisterApi: function(gridApi){
                $vm.selfWorkGridApi = gridApi;
            }
        }
    });

    function LoadOrderList(){
        RestfulApi.SearchMSSQLData({
            querymain: 'selfWork',
            queryname: 'SelectOrderList'
        }).then(function (res){
            console.log(res["returnData"]);
            $vm.selfWorkData = res["returnData"];
        }).finally(function() {
            HandleWindowResize($vm.selfWorkGridApi);
        });    
    };

})