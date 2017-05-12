"use strict";

angular.module('app.selfwork').controller('EmployeeJobsCtrl', function ($scope, $stateParams, $state, AuthApi, Session, toaster, $uibModal, $templateCache, uiGridConstants, RestfulApi, compyFilter) {
    
    var $vm = this;

	angular.extend(this, {
        Init : function(){
            LoadOrderList();
        },
        profile : Session.Get(),
        defaultChoice : 'Left',
        gridMethodForJob001 : {
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
        gridMethodForJob002 : {
            //退件
            rejectData : function(row){
                console.log(row);
            },
            //編輯
            modifyData : function(row){
                console.log(row);
                $state.transitionTo("app.selfwork.employeejobs.job002", {
                    data: row.entity
                });
            },
            //結單
            closeData : function(row){
                console.log(row);
            }
        },
        gridMethodForJob003 : {
            //退件
            rejectData : function(row){
                console.log(row);
            },
            //編輯
            modifyData : function(row){
                console.log(row);
                $state.transitionTo("app.selfwork.employeejobs.job003", {
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
                { name: 'ITEM_LIST'          ,  displayName: '報機單', enableFiltering: false, cellTemplate: $templateCache.get('accessibilityToDMCForJob001') },
                { name: 'FLIGHT_ITEM_LIST'   ,  displayName: '銷艙單', enableFiltering: false, cellTemplate: $templateCache.get('accessibilityToDMCForJob002') },
                { name: 'DELIVERY_ITEM_LIST' ,  displayName: '派送單', enableFiltering: false, cellTemplate: $templateCache.get('accessibilityToDMCForJob003') }
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
            querymain: 'employeeJobs',
            queryname: 'SelectOrderList'
        }).then(function (res){
            console.log(res["returnData"]);
            $vm.selfWorkData = res["returnData"];
        }).finally(function() {
            HandleWindowResize($vm.selfWorkGridApi);
        });    
    };

})