"use strict";

angular.module('app.selfwork').controller('LeaderJobsCtrl', function ($scope, $stateParams, $state, AuthApi, Session, toaster, $uibModal, $templateCache, uiGridConstants, RestfulApi, compy, userInfoByGrade) {
    
    var $vm = this,
        _tasks = [];

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
                { name: 'W2'          ,  displayName: '報機單', cellFilter: 'userInfoFilter', cellTemplate: $templateCache.get('accessibilityToForW2') },
                { name: 'W3'          ,  displayName: '銷艙單', cellFilter: 'userInfoFilter', cellTemplate: $templateCache.get('accessibilityToForW3') },
                { name: 'W1'          ,  displayName: '派送單', cellFilter: 'userInfoFilter', cellTemplate: $templateCache.get('accessibilityToForW1') }
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

                    var _params = {};
                    _params["OL_"+$vm.selectAssignDept+"_PRINCIPAL"] = _getSelectedRows[i][$vm.selectAssignDept];
                    // _params["OL_"+$vm.selectAssignDept+"_EDIT_DATETIME"] = null;
                    // _params["OL_"+$vm.selectAssignDept+"_OK_DATETIME"] = null;

                    _tasks.push({
                        crudType: 'Update',
                        updatename: 'Update',
                        table: 18,
                        params: _params,
                        condition: {
                            OL_SEQ : _getSelectedRows[i].OL_SEQ,
                            OL_CR_USER : _getSelectedRows[i].OL_CR_USER
                        }
                    });
                }

                $vm.Save();
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

                        var _params = {};
                        _params["OL_"+$vm.selectAssignDept+"_PRINCIPAL"] = $vm.vmData[i][$vm.selectAssignDept];
                        // _params["OL_"+$vm.selectAssignDept+"_EDIT_DATETIME"] = null;
                        // _params["OL_"+$vm.selectAssignDept+"_OK_DATETIME"] = null;

                        _tasks.push({
                            crudType: 'Update',
                            updatename: 'Update',
                            table: 18,
                            params: _params,
                            condition: {
                                OL_SEQ : $vm.vmData[i].OL_SEQ,
                                OL_CR_USER : $vm.vmData[i].OL_CR_USER
                            }
                        });
                    }
                }

                $vm.Save();
            }
        },
        CancelPrincipal : function(){
            if($vm.orderListGridApi.selection.getSelectedRows().length > 0){
                var _getSelectedRows = $vm.orderListGridApi.selection.getSelectedRows();
                for(var i in _getSelectedRows){
                    _getSelectedRows[i][$vm.selectAssignDept] = null;

                    var _params = {};
                    _params["OL_"+$vm.selectAssignDept+"_PRINCIPAL"] = _getSelectedRows[i][$vm.selectAssignDept];
                    // _params["OL_"+$vm.selectAssignDept+"_EDIT_DATETIME"] = null;
                    // _params["OL_"+$vm.selectAssignDept+"_OK_DATETIME"] = null;

                    _tasks.push({
                        crudType: 'Update',
                        updatename: 'Update',
                        table: 18,
                        params: _params,
                        condition: {
                            OL_SEQ : _getSelectedRows[i].OL_SEQ,
                            OL_CR_USER : _getSelectedRows[i].OL_CR_USER
                        }
                    });
                }

                $vm.Save();
            }
        },
        Save : function(){
            console.log($vm.vmData);

            RestfulApi.CRUDMSSQLDataByTask(_tasks).then(function (res) {
                console.log(res["returnData"]);
                
                LoadOrderList();
                // toaster.pop('success', '訊息', '派單完成', 3000);
            }, function (err) {

            }).finally(function() {
                _tasks = [];
            });
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