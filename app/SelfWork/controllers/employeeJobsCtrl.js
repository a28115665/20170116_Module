"use strict";

angular.module('app.selfwork').controller('EmployeeJobsCtrl', function ($scope, $stateParams, $state, AuthApi, Session, toaster, $uibModal, $templateCache, $filter, uiGridConstants, RestfulApi, compy, $q) {
    
    var $vm = this;

	angular.extend(this, {
        Init : function(){
            LoadOrderList();
        },
        profile : Session.Get(),
        defaultChoice : 'Left',
        gridMethod : {
            // 各單的工作選項
            gridOperation : function(row, name){
                // 給modal知道目前是哪個欄位操作
                row.entity['name'] = name;

                var modalInstance = $uibModal.open({
                    animation: true,
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    templateUrl: 'opWorkMenu.html',
                    controller: 'OpWorkMenuModalInstanceCtrl',
                    controllerAs: '$ctrl',
                    scope: $scope,
                    size: 'sm',
                    // windowClass: 'center-modal',
                    // appendTo: parentElem,
                    resolve: {
                        items: function() {
                            return row;
                        }
                    }
                });

                modalInstance.result.then(function(selectedItem) {
                    // $ctrl.selected = selectedItem;
                    console.log(selectedItem);

                }, function() {
                    // $log.info('Modal dismissed at: ' + new Date());
                });
            },
            // 各單的修改
            modifyData : function(row){
                console.log(row);
                var modalInstance = $uibModal.open({
                    animation: true,
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    template: $templateCache.get('modifyOrderList'),
                    controller: 'ModifyOrderListModalInstanceCtrl',
                    controllerAs: '$ctrl',
                    // size: 'sm',
                    // windowClass: 'center-modal',
                    // appendTo: parentElem,
                    resolve: {
                        vmData: function() {
                            return row.entity;
                        },
                        compy: function() {
                            return compy;
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
                            OL_IMPORTDT : selectedItem.OL_IMPORTDT,
                            OL_CO_CODE  : selectedItem.OL_CO_CODE,
                            OL_FLIGHTNO : selectedItem.OL_FLIGHTNO,
                            OL_MASTER   : selectedItem.OL_MASTER,
                            OL_COUNTRY  : selectedItem.OL_COUNTRY
                        },
                        condition: {
                            OL_SEQ : selectedItem.OL_SEQ
                        }
                    }).then(function (res) {
                        LoadOrderList();
                    });

                }, function() {
                    // $log.info('Modal dismissed at: ' + new Date());
                });
            }
        },
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
                        },
                        show: function(){
                            return {
                                title : "是否退單"
                            }
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
            // 編輯
            modifyData : function(row){
                console.log(row);

                // 如果是第一次編輯 會先記錄編輯時間
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
                }else{
                    $state.transitionTo("app.selfwork.employeejobs.job001", {
                        data: row.entity
                    });
                }
            },
            // 完成
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
            },
            // 刪除報機單
            deleteData : function(row){

            }
        },
        gridMethodForJob002 : {
            // 退件
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
            // 編輯
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
                }else{
                    $state.transitionTo("app.selfwork.employeejobs.job002", {
                        data: row.entity
                    });
                }
            },
            // 結單
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
            },
            // 刪除銷艙單
            deleteData : function(row){

            }
        },
        gridMethodForJob003 : {
            // 退件
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
            // 編輯
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
                }else{
                    $state.transitionTo("app.selfwork.employeejobs.job003", {
                        data: row.entity
                    });
                }
            },
            // 結單
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
            },
            // 刪除派送單
            deleteData : function(row){

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
                { name: 'OL_COUNT'    ,  displayName: '報機單(袋數)', enableCellEdit: false },
                { name: 'OL_COUNTRY'  ,  displayName: '起運國別' },
                { name: 'ITEM_LIST'          ,  displayName: '報機單', enableFiltering: false, width: '8%', cellTemplate: $templateCache.get('accessibilityToOperaForJob001') },
                { name: 'FLIGHT_ITEM_LIST'   ,  displayName: '銷艙單', enableFiltering: false, width: '8%', cellTemplate: $templateCache.get('accessibilityToOperaForJob002') },
                { name: 'DELIVERY_ITEM_LIST' ,  displayName: '派送單', enableFiltering: false, width: '8%', cellTemplate: $templateCache.get('accessibilityToOperaForJob003') },
                { name: 'Options'       , displayName: '操作', width: '5%', enableCellEdit: false, enableFiltering: false, cellTemplate: $templateCache.get('accessibilityToM') }
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
        },
        Update : function(entity){
            // create a fake promise - normally you'd use the promise returned by $http or $resource
            var promise = $q.defer();
            $vm.selfWorkGridApi.rowEdit.setSavePromise( entity, promise.promise );
         
            RestfulApi.UpdateMSSQLData({
                updatename: 'Update',
                table: 18,
                params: {
                    OL_IMPORTDT   : entity.OL_IMPORTDT,
                    OL_CO_CODE    : entity.OL_CO_CODE,
                    OL_FLIGHTNO   : entity.OL_FLIGHTNO,
                    OL_MASTER     : entity.OL_MASTER,
                    OL_COUNTRY    : entity.OL_COUNTRY
                },
                condition: {
                    OL_SEQ        : entity.OL_SEQ
                }
            }).then(function (res) {
                promise.resolve();
            }, function (err) {
                toaster.pop('danger', '錯誤', '更新失敗', 3000);
                promise.reject();
            });
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
.controller('OpWorkMenuModalInstanceCtrl', function ($scope, $uibModalInstance, items) {
    var $ctrl = this;
    $ctrl.appScope = $scope.$parent.$vm;
    $ctrl.row = items;
    
    $ctrl.ok = function() {
        $uibModalInstance.close(items);
    };

    $ctrl.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
});