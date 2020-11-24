"use strict";

angular.module('app.oselfwork').controller('ODeliveryJobsCtrl', function ($scope, $stateParams, $state, RestfulApi, Session, toaster, $uibModal, $templateCache, uiGridConstants, ocompy, $filter, OrderStatus, sysParm) {
    
    var $vm = this;

	angular.extend(this, {
        Init : function(){
            LoadODeliveryItem();
        },
        profile : Session.Get(),
        gridMethod : {
            // 各單的工作選項
            gridOperation : function(row, name){
                // 給modal知道目前是哪個欄位操作
                row.entity['name'] = name;

                var modalInstance = $uibModal.open({
                    animation: true,
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    templateUrl: 'oopWorkMenu.html',
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
                    template: $templateCache.get('modifyOOrderList'),
                    controller: 'ModifyOOrderListModalInstanceCtrl',
                    controllerAs: '$ctrl',
                    // size: 'sm',
                    // windowClass: 'center-modal',
                    // appendTo: parentElem,
                    resolve: {
                        vmData: function() {
                            return row.entity;
                        },
                        ocompy: function() {
                            return ocompy;
                        }
                    }
                });

                modalInstance.result.then(function(selectedItem) {
                    // $ctrl.selected = selectedItem;
                    console.log(selectedItem);

                    RestfulApi.UpdateMSSQLData({
                        updatename: 'Update',
                        table: 40,
                        params: {
                            O_OL_IMPORTDT          : selectedItem.O_OL_IMPORTDT,
                            O_OL_CO_CODE           : selectedItem.O_OL_CO_CODE,
                            O_OL_MASTER            : selectedItem.O_OL_MASTER,
                            O_OL_PASSCODE          : selectedItem.O_OL_PASSCODE,
                            O_OL_VOYSEQ            : selectedItem.O_OL_VOYSEQ,
                            O_OL_MVNO              : selectedItem.O_OL_MVNO,
                            O_OL_COMPID            : selectedItem.O_OL_COMPID,
                            O_OL_ARRLOCATIONID     : selectedItem.O_OL_ARRLOCATIONID,
                            O_OL_POST              : selectedItem.O_OL_POST,
                            O_OL_PACKAGELOCATIONID : selectedItem.O_OL_PACKAGELOCATIONID,
                            O_OL_BOATID            : selectedItem.O_OL_BOATID,
                            O_OL_REASON            : selectedItem.O_OL_REASON
                        },
                        condition: {
                            O_OL_SEQ : selectedItem.O_OL_SEQ
                        }
                    }).then(function (res) {
                        LoadODeliveryItem();
                    });

                }, function() {
                    // $log.info('Modal dismissed at: ' + new Date());
                });
            },
            // 結單權限
            closeAuth : function(row){
                if(row.entity.TOTAL_NUM == row.entity.C1 || ['Admin', 'PUser'].indexOf($vm.profile.U_ROLE) != -1){
                    return '';
                }else{
                    return 'disabled';
                }
            },
            // 結單
            closeData : function(row){
                console.log(row);

                if(row.entity.TOTAL_NUM == row.entity.C1 || ['Admin', 'PUser'].indexOf($vm.profile.U_ROLE) != -1){
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
                                    title : "是否結單"
                                }
                            }
                        }
                    });

                    modalInstance.result.then(function(selectedItem) {
                        // $ctrl.selected = selectedItem;
                        console.log(selectedItem);

                        RestfulApi.UpdateMSSQLData({
                            updatename: 'Update',
                            table: 40,
                            params: {
                                O_OL_FUSER2 : $vm.profile.U_ID,
                                O_OL_FDATETIME2 : $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')
                            },
                            condition: {
                                O_OL_SEQ : selectedItem.O_OL_SEQ
                            }
                        }).then(function (res) {
                            LoadODeliveryItem();
                            toaster.pop('success', '訊息', '結單完成', 3000);
                        });

                    }, function() {
                        // $log.info('Modal dismissed at: ' + new Date());
                    });
                }
            }
        },
        gridMethodForJob003 : {
            // 編輯
            modifyData : function(row){
                console.log(row);

                // 如果是第一次編輯 會先記錄編輯時間
                if(row.entity.W1_EDATETIME == null){
                    // 檢查是否有人編輯
                    RestfulApi.SearchMSSQLData({
                        querymain: 'employeeJobs',
                        queryname: 'SelectOrderEditor',
                        params: {
                            OE_SEQ : row.entity.OL_SEQ,
                            OE_TYPE : 'D'
                        }
                    }).then(function (res){
                        // 有 警告並且重Load資料
                        // 沒有 新增資料到DB
                        if(res["returnData"].length > 0){
                            LoadOrderList();
                            toaster.pop('warning', '警告', '此單已有人編輯', 3000);
                        }else{
                            RestfulApi.InsertMSSQLData({
                                insertname: 'Insert',
                                table: 22,
                                params: {
                                    OE_SEQ : row.entity.OL_SEQ,
                                    OE_TYPE : 'D', // 派送單
                                    OE_PRINCIPAL : $vm.profile.U_ID,
                                    OE_EDATETIME : $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')
                                }
                            }).then(function (res) {
                                $state.transitionTo("app.selfwork.deliveryjobs.job003", {
                                    data: row.entity
                                });
                            });
                        }
                    });
                }else{
                    $state.transitionTo("app.selfwork.deliveryjobs.job003", {
                        data: row.entity
                    });
                }
            },
            // 檢視
            viewData : function(row){
                $state.transitionTo("app.oselfwork.odeliveryjobs.ojob003", {
                    data: row.entity
                });
            },
            // 完成
            closeData : function(row){
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
                                title : "是否完成"
                            }
                        }
                    }
                });

                modalInstance.result.then(function(selectedItem) {
                    // $ctrl.selected = selectedItem;
                    console.log(selectedItem);

                    RestfulApi.UpdateMSSQLData({
                        updatename: 'Update',
                        table: 22,
                        params: {
                            OE_FDATETIME : $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')
                        },
                        condition: {
                            OE_SEQ : selectedItem.OL_SEQ,
                            OE_TYPE : 'D',
                            OE_PRINCIPAL : $vm.profile.U_ID
                        }
                    }).then(function (res) {
                        LoadODeliveryItem();
                    });

                }, function() {
                    // $log.info('Modal dismissed at: ' + new Date());
                });
            },
            // 修改
            // 已編輯且完成就可以讓所有人修改
            fixData : function(row){
                console.log(row);
                if(row.entity.W1_FDATETIME != null){
                    $state.transitionTo("app.selfwork.deliveryjobs.job003", {
                        data: row.entity
                    });
                }
            },
            // 刪除派送單
            deleteData : function(row){
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
                                title : "是否刪除"
                            }
                        }
                    }
                });

                modalInstance.result.then(function(selectedItem) {
                    // $ctrl.selected = selectedItem;
                    console.log(selectedItem);

                    RestfulApi.DeleteMSSQLData({
                        deletename: 'Delete',
                        table: 11,
                        params: {
                            IL_SEQ : selectedItem.OL_SEQ
                        }
                    }).then(function (res) {
                        toaster.pop('info', '訊息', '派送單刪除成功', 3000);
                        LoadODeliveryItem();
                    });

                }, function() {
                    // $log.info('Modal dismissed at: ' + new Date());
                });
            }
        },
        odeliveryItemOptions : {
            data:  '$vm.odeliveryItemData',
            columnDefs: [
                { name: 'O_OL_IMPORTDT' ,  displayName: '報機日期', width: 91, pinnedLeft:true, cellFilter: 'dateFilter', cellTooltip: cellTooltip },
                { name: 'O_CO_NAME'     ,  displayName: '行家', width: 66, pinnedLeft:true, cellTooltip: cellTooltip },
                { name: 'O_OL_MASTER'   ,  displayName: '主號', width: 133, pinnedLeft:true, cellTooltip: cellTooltip },
                { name: 'O_OL_PASSCODE'          ,  displayName: '通關號碼', width: 91, cellTooltip: cellTooltip },
                { name: 'O_OL_VOYSEQ'            ,  displayName: '航次', width: 66, cellTooltip: cellTooltip },
                { name: 'O_OL_MVNO'              ,  displayName: '呼號', width: 66, cellTooltip: cellTooltip },
                { name: 'O_OL_COMPID'            ,  displayName: '船公司代碼', width: 103, cellTooltip: cellTooltip },
                { name: 'O_OL_ARRLOCATIONID'     ,  displayName: '卸存地點', width: 91, cellTooltip: cellTooltip },
                { name: 'O_OL_POST'              ,  displayName: '裝貨港', width: 78, cellTooltip: cellTooltip },
                { name: 'O_OL_PACKAGELOCATIONID' ,  displayName: '暫存地點', width: 91, cellTooltip: cellTooltip },
                { name: 'O_OL_BOATID'            ,  displayName: '船機代碼', width: 91, cellTooltip: cellTooltip },
                { name: 'O_OL_REASON'   ,  displayName: '描述', width: 100, cellTooltip: cellTooltip },
                { name: 'TOTAL_NUM'   ,  displayName: '總件數', width: 77 },
                { name: 'C1'   ,  displayName: '清出(件數)', width: 86 },
                { name: 'OtherC1'   ,  displayName: '非清出(件數)', width: 86 },
                { name: 'ITEM_LIST'          ,  displayName: '日報明細', enableFiltering: false, width: 100, cellTemplate: $templateCache.get('accessibilityToOperaForJob003'), pinnedRight:true },
                // { name: 'FLIGHT_ITEM_LIST'   ,  displayName: '銷艙單', enableFiltering: false, width: '8%', cellTemplate: $templateCache.get('accessibilityToOperaForJob002') },
                // { name: 'DELIVERY_ITEM_LIST' ,  displayName: '派送單', enableFiltering: false, width: 86, cellTemplate: $templateCache.get('accessibilityToOperaForJob003') },
                { name: 'Options'       , displayName: '操作', width: 107, enableCellEdit: false, enableFiltering: false, cellTemplate: $templateCache.get('deliveryJobsToMC'), pinnedRight:true }
            ],
            enableFiltering: true,
            enableSorting: true,
            enableColumnMenus: false,
            // enableVerticalScrollbar: false,
            paginationPageSizes: [10, 25, 50, 100],
            paginationPageSize: 100,
            onRegisterApi: function(gridApi){
                $vm.odeliveryItemGridApi = gridApi;
            }
        },
        // 自動結單
        AutoCloseData : function(){

            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'odeliveryJobsAutoCloseDataModalContent.html',
                controller: 'ODeliveryJobsAutoCloseDataInstanceCtrl',
                controllerAs: '$ctrl',
                // windowClass: 'my-xl-modal-window',
                backdrop: 'static',
                // size: 'lg',
                // appendTo: parentElem,
                resolve: {
                    sysParm: function() {
                        return sysParm;
                    }
                }
            });

            modalInstance.result.then(function(selectedItem) {
                console.log(selectedItem);

                RestfulApi.UpdateMSSQLData({
                    updatename: 'Update',
                    table: 26,
                    params: {
                        O_SPA_AUTOCLOSE : selectedItem['O_SPA_AUTOCLOSE'],
                        O_SPA_AUTOCLOSE_INTRVAL : selectedItem['O_SPA_AUTOCLOSE_INTRVAL']
                    },
                    condition: {
                        SPA_KEY : 'systemParameter'
                    }
                }).then(function (res) {
                    
                    if(res['returnData'] == 1){
                        if(sysParm['O_SPA_AUTOCLOSE']){
                            toaster.pop('info', '訊息', '開啟自動結單', 3000);
                        }else{
                            toaster.pop('info', '訊息', '關閉自動結單', 3000);
                        }
                    }

                });
            })
        },
        // 結單
        CloseData : function(){
            if($vm.odeliveryItemGridApi.selection.getSelectedRows().length > 0){

                var _getSelectedRows = $vm.odeliveryItemGridApi.selection.getSelectedRows(),
                    _tasks = [];

                for(var i in _getSelectedRows){
                    if(_getSelectedRows[i].TOTAL_NUM == _getSelectedRows[i].C1 || ['Admin', 'PUser'].indexOf($vm.profile.U_ROLE) != -1){
                        // console.log(_getSelectedRows[i]);
                        _tasks.push({
                            crudType: 'Update',
                            table: 40,
                            params: {
                                O_OL_FUSER2 : $vm.profile.U_ID,
                                O_OL_FDATETIME2 : $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')
                            },
                            condition: {
                                O_OL_SEQ : _getSelectedRows[i].O_OL_SEQ
                            }
                        });
                    }
                }
                
                $vm.odeliveryItemGridApi.selection.clearSelectedRows();

                if(_tasks.length == 0){
                    toaster.pop('info', '訊息', '沒有需要結單的項目', 3000);
                    return;
                }

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
                            return {};
                        },
                        show: function(){
                            return {
                                title : "是否結單"
                            }
                        }
                    }
                });

                modalInstance.result.then(function(selectedItem) {

                    RestfulApi.CRUDMSSQLDataByTask(_tasks).then(function (res) {
                        LoadODeliveryItem();
                        toaster.pop('success', '訊息', '結單完成', 3000);
                    }, function (err) {

                    });

                })

            }
        }
    });

    function LoadODeliveryItem(){
        RestfulApi.SearchMSSQLData({
            querymain: 'odeliveryJobs',
            queryname: 'SelectODeliveryItem',
            params: {
                U_ID : $vm.profile.U_ID,
                U_GRADE : $vm.profile.U_GRADE
                // DEPTS : $vm.profile.DEPTS
            }
        }).then(function (res){
            console.log(res["returnData"]);
            $vm.odeliveryItemData = res["returnData"];
        });
    };

})
.controller('ODeliveryJobsAutoCloseDataInstanceCtrl', function ($uibModalInstance, sysParm) {
    var $ctrl = this;
    $ctrl.sysParm = sysParm;

    $ctrl.ok = function() {
        $uibModalInstance.close($ctrl.sysParm);
    };

    $ctrl.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
});