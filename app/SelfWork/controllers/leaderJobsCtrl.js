"use strict";

angular.module('app.selfwork').controller('LeaderJobsCtrl', function ($scope, $stateParams, $state, AuthApi, Session, toaster, $uibModal, $templateCache, uiGridConstants, RestfulApi, compy, userInfoByGrade) {
    
    var $vm = this;

	angular.extend(this, {
        Init : function(){
            $vm.selectAssignDept = userInfoByGrade[0][0].value;
            LoadOrderList();
            LoadPrincipal();
        },
        profile : Session.Get(),
        assignGradeData : userInfoByGrade[0],
        assignPrincipalData : userInfoByGrade[1],
        orderListOptions : {
            data:  '$vm.vmData',
            columnDefs: [
                { name: 'OL_IMPORTDT' ,  displayName: '進口日期', cellFilter: 'dateFilter' },
                { name: 'OL_CO_CODE'  ,  displayName: '行家', cellFilter: 'compyFilter', filter: 
                    {
                        term: null,
                        type: uiGridConstants.filter.SELECT,
                        selectOptions: compy
                    }
                },
                { name: 'OL_FLIGHTNO' ,  displayName: '航班' },
                { name: 'OL_MASTER'   ,  displayName: '主號' },
                { name: 'OL_COUNTRY'  ,  displayName: '起運國別' },
                { name: 'W2'          ,  displayName: '報機單', cellFilter: 'userInfoFilter' },
                { name: 'W3'          ,  displayName: '銷艙單', cellFilter: 'userInfoFilter' },
                { name: 'W1'          ,  displayName: '派送單', cellFilter: 'userInfoFilter' }
            ],
            enableFiltering: true,
            enableSorting: true,
            enableColumnMenus: false,
            // enableVerticalScrollbar: false,
            paginationPageSizes: [10, 25, 50],
            paginationPageSize: 10,
            onRegisterApi: function(gridApi){
                $vm.orderListGridApi = gridApi;
            }
        },
        CustomizeAssign : function(){
            if($vm.orderListGridApi.selection.getSelectedRows().length > 0){
                var _getSelectedRows = $vm.orderListGridApi.selection.getSelectedRows();
                for(var i in _getSelectedRows){
                    _getSelectedRows[i][$vm.selectAssignDept] = $vm.selectAssignPrincipal;
                }
            }
        },
        AutoAssign : function(){
            if($vm.principalData.length > 0){
                var _principalData = {};
                for(var i in $vm.principalData){
                    _principalData[$vm.principalData[i].COD_CODE] = $vm.principalData[i].WHO_PRINCIPAL;
                }

                for(var i in $vm.vmData){
                    if(!angular.isUndefined(_principalData[$vm.vmData[i].OL_CO_CODE])){
                        $vm.vmData[i][$vm.selectAssignDept] = _principalData[$vm.vmData[i].OL_CO_CODE];
                    }
                }
            }
        },
        CancelPrincipal : function(){
            if($vm.orderListGridApi.selection.getSelectedRows().length > 0){
                var _getSelectedRows = $vm.orderListGridApi.selection.getSelectedRows();
                for(var i in _getSelectedRows){
                    _getSelectedRows[i][$vm.selectAssignDept] = null;
                }
            }
        },
        LoadPrincipal : function(){
            LoadPrincipal()
        }
    });

    function LoadOrderList(){
        RestfulApi.SearchMSSQLData({
            querymain: 'leaderJobs',
            queryname: 'SelectOrderList'
        }).then(function (res){
            console.log(res["returnData"]);
            $vm.vmData = res["returnData"];
        });  

        // RestfulApi.CRUDMSSQLDataByTask([
        //     {
        //         crudType: 'Select',
        //         querymain: 'leaderJobs',
        //         queryname: 'SelectOrderList'
        //     },
        //     {
        //         crudType: 'Select',
        //         querymain: 'leaderJobs',
        //         queryname: 'WhoPrincipal',
        //         params: {
        //             AS_DEPT : $vm.selectAssignPrincipal
        //         }
        //     }
        // ]).then(function (res) {
        //     console.log(res["returnData"]);

        //     $vm.vmData = res["returnData"][0];
        //     $vm.vmData = res["returnData"][1];
        // }, function (err) {

        // });
    };

    function LoadPrincipal(){
        RestfulApi.SearchMSSQLData({
            querymain: 'leaderJobs',
            queryname: 'WhoPrincipal',
            params: {
                AS_DEPT : $vm.selectAssignDept
            }
        }).then(function (res){
            console.log(res["returnData"]);
            $vm.principalData = res["returnData"];
        });  
    };

})