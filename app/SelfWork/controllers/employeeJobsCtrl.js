"use strict";

angular.module('app.selfwork').controller('EmployeeJobsCtrl', function ($scope, $stateParams, $state, AuthApi, Session, toaster, $uibModal, $templateCache, $filter, uiGridConstants, RestfulApi, compy) {
    
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

                var modalInstance = $uibModal.open({
                    animation: true,
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    template: $templateCache.get('isChecked'),
                    controller: 'IsCheckedModalInstanceCtrl',
                    controllerAs: '$ctrl',
                    size: 'sm',
                    windowClass: 'center-modal',
                    // appendTo: parentElem,
                    resolve: {
                        items: function() {
                            return row.entity;
                        }
                    }
                });

                modalInstance.result.then(function(selectedItem) {
                    // $ctrl.selected = selectedItem;
                    console.log(selectedItem);
                    
                    RestfulApi.UpdateMSSQLData({
                        updatename: 'Update',
                        table: 18,
                        params: {
                            OL_W2_PRINCIPAL : null
                        },
                        condition: {
                            OL_SEQ : selectedItem.OL_SEQ,
                            OL_CR_USER : selectedItem.OL_CR_USER
                        }
                    }).then(function (res) {
                        LoadOrderList();
                    });

                }, function() {
                    // $log.info('Modal dismissed at: ' + new Date());
                });
            },
            //編輯
            modifyData : function(row){
                console.log(row);

                if(row.entity.OL_W2_EDIT_DATETIME == null){
                    RestfulApi.UpdateMSSQLData({
                        updatename: 'Update',
                        table: 18,
                        params: {
                            OL_W2_EDIT_DATETIME : $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')
                        },
                        condition: {
                            OL_SEQ : row.entity.OL_SEQ,
                            OL_CR_USER : row.entity.OL_CR_USER
                        }
                    }).then(function (res) {
                        $state.transitionTo("app.selfwork.employeejobs.job001", {
                            data: row.entity
                        });
                    });
                }
            },
            //結單
            closeData : function(row){
                console.log(row);

                RestfulApi.UpdateMSSQLData({
                    updatename: 'Update',
                    table: 18,
                    params: {
                        OL_W2_OK_DATETIME : $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')
                    },
                    condition: {
                        OL_SEQ : row.entity.OL_SEQ,
                        OL_CR_USER : row.entity.OL_CR_USER
                    }
                }).then(function (res) {
                    LoadOrderList();
                });
            }
        },
        gridMethodForJob002 : {
            //退件
            rejectData : function(row){
                console.log(row);

                RestfulApi.UpdateMSSQLData({
                    updatename: 'Update',
                    table: 18,
                    params: {
                        OL_W3_PRINCIPAL : null
                    },
                    condition: {
                        OL_SEQ : row.entity.OL_SEQ,
                        OL_CR_USER : row.entity.OL_CR_USER
                    }
                }).then(function (res) {
                    LoadOrderList();
                });
            },
            //編輯
            modifyData : function(row){
                console.log(row);

                if(row.entity.OL_W3_EDIT_DATETIME == null){
                    RestfulApi.UpdateMSSQLData({
                        updatename: 'Update',
                        table: 18,
                        params: {
                            OL_W3_EDIT_DATETIME : $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')
                        },
                        condition: {
                            OL_SEQ : row.entity.OL_SEQ,
                            OL_CR_USER : row.entity.OL_CR_USER
                        }
                    }).then(function (res) {
                        $state.transitionTo("app.selfwork.employeejobs.job002", {
                            data: row.entity
                        });
                    });
                }
            },
            //結單
            closeData : function(row){
                console.log(row);

                RestfulApi.UpdateMSSQLData({
                    updatename: 'Update',
                    table: 18,
                    params: {
                        OL_W3_OK_DATETIME : $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')
                    },
                    condition: {
                        OL_SEQ : row.entity.OL_SEQ,
                        OL_CR_USER : row.entity.OL_CR_USER
                    }
                }).then(function (res) {
                    LoadOrderList();
                });
            }
        },
        gridMethodForJob003 : {
            //退件
            rejectData : function(row){
                console.log(row);

                RestfulApi.UpdateMSSQLData({
                    updatename: 'Update',
                    table: 18,
                    params: {
                        OL_W1_PRINCIPAL : null
                    },
                    condition: {
                        OL_SEQ : row.entity.OL_SEQ,
                        OL_CR_USER : row.entity.OL_CR_USER
                    }
                }).then(function (res) {
                    LoadOrderList();
                });
            },
            //編輯
            modifyData : function(row){
                console.log(row);

                if(row.entity.OL_W1_EDIT_DATETIME == null){
                    RestfulApi.UpdateMSSQLData({
                        updatename: 'Update',
                        table: 18,
                        params: {
                            OL_W1_EDIT_DATETIME : $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')
                        },
                        condition: {
                            OL_SEQ : row.entity.OL_SEQ,
                            OL_CR_USER : row.entity.OL_CR_USER
                        }
                    }).then(function (res) {
                        $state.transitionTo("app.selfwork.employeejobs.job003", {
                            data: row.entity
                        });
                    });
                }
            },
            //結單
            closeData : function(row){
                console.log(row);

                RestfulApi.UpdateMSSQLData({
                    updatename: 'Update',
                    table: 18,
                    params: {
                        OL_W1_OK_DATETIME : $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')
                    },
                    condition: {
                        OL_SEQ : row.entity.OL_SEQ,
                        OL_CR_USER : row.entity.OL_CR_USER
                    }
                }).then(function (res) {
                    LoadOrderList();
                });
            }
        },
        orderListOptions : {
            data:  '$vm.selfWorkData',
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
                { name: 'OL_COUNT'    ,  displayName: '袋數' },
                { name: 'OL_COUNTRY'  ,  displayName: '起運國別' },
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
            queryname: 'SelectOrderList',
            params: {
                U_ID : $vm.profile.U_ID,
                DEPTS : $vm.profile.DEPTS
            }
        }).then(function (res){
            console.log(res["returnData"]);
            $vm.selfWorkData = res["returnData"];
        }).finally(function() {
            HandleWindowResize($vm.selfWorkGridApi);
        });    
    };

})