"use strict";

angular.module('app.selfwork').controller('DeliveryJobsCtrl', function ($scope, $stateParams, $state, RestfulApi, Session, toaster, $uibModal, $templateCache, uiGridConstants, compy, $filter, OrderStatus) {
    
    var $vm = this;

	angular.extend(this, {
        Init : function(){
            LoadDeliveryItem();
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
                            OL_REAL_IMPORTDT : selectedItem.OL_REAL_IMPORTDT,
                            OL_CO_CODE  : selectedItem.OL_CO_CODE,
                            OL_FLIGHTNO : selectedItem.OL_FLIGHTNO,
                            OL_MASTER   : selectedItem.OL_MASTER,
                            OL_COUNTRY  : selectedItem.OL_COUNTRY,
                            OL_REASON   : selectedItem.OL_REASON
                        },
                        condition: {
                            OL_SEQ : selectedItem.OL_SEQ
                        }
                    }).then(function (res) {
                        LoadDeliveryItem();
                    });

                }, function() {
                    // $log.info('Modal dismissed at: ' + new Date());
                });
            },
            // 顯示分批明細
            showApaccsDetail : function(row){

                if(row.entity.AML_DELIVERY == 0) {
                    toaster.pop('info', '訊息', '查無資料。', 3000);
                    return;
                }

                RestfulApi.SearchMSSQLData({
                    querymain: 'deliveryJobs',
                    queryname: 'SelectApaccsDetail',
                    params: {
                        AML_SEQ : row.entity.OL_SEQ
                    }
                }).then(function (res){
                    console.log(res["returnData"]);

                    var _vmData = res["returnData"] || [];

                    var modalInstance = $uibModal.open({
                        animation: true,
                        ariaLabelledBy: 'modal-title',
                        ariaDescribedBy: 'modal-body',
                        templateUrl: 'deliveryJobsShowApaccsDetail.html',
                        controller: 'deliveryJobsShowApaccsDetailCtrl',
                        controllerAs: '$ctrl',
                        windowClass: 'my-xl-modal-window',
                        // size: 'lg',
                        // windowClass: 'center-modal',
                        // appendTo: parentElem,
                        resolve: {
                            item: function(){
                                return row.entity;
                            },
                            vmData: function() {
                                return _vmData;
                            }
                        }
                    });

                    modalInstance.result.then(function(selectedItem) {

                    }, function() {
                        // $log.info('Modal dismissed at: ' + new Date());
                    });
                });
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
            // 貨物查看
            viewOrder : function(row){
                OrderStatus.Get(row)
            },
            // 檢視
            viewData : function(row){
                $state.transitionTo("app.selfwork.deliveryjobs.job003", {
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
                        LoadDeliveryItem();
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
                        LoadDeliveryItem();
                    });

                }, function() {
                    // $log.info('Modal dismissed at: ' + new Date());
                });
            }
        },
        deliveryItemOptions : {
            data:  '$vm.deliveryItemData',
            columnDefs: [
                { name: 'OL_IMPORTDT' ,  displayName: '進口日期', width: 91, cellFilter: 'dateFilter' },
                { name: 'OL_REAL_IMPORTDT' ,  displayName: '報機日期', width: 91, cellFilter: 'dateFilter', cellTooltip: function (row, col) 
                    {
                        return '真實報機日期：' + $filter('dateFilter')(row.entity.OL_CR_DATETIME)
                    } 
                },
                { name: 'CO_NAME'     ,  displayName: '行家', width: 80 },
                { name: 'OL_FLIGHTNO' ,  displayName: '航班', width: 80 },
                { name: 'FA_SCHEDL_ARRIVALTIME'  ,  displayName: '預計抵達時間', cellFilter: 'datetimeFilter' },
                { name: 'FA_ARRIVAL_REMK'        ,  displayName: '狀態', width: 60, cellTemplate: $templateCache.get('accessibilityToArrivalRemark') },
                { name: 'OL_MASTER'              ,  displayName: '主號', width: 110, cellTemplate: $templateCache.get('accessibilityToMasterForViewOrder') },
                { name: 'OL_COUNTRY'  ,  displayName: '起運國別' },
                { name: 'OL_REASON'   ,  displayName: '描述', width: 100, cellTooltip: cellTooltip },
                { name: 'AML_DELIVERY'   ,  displayName: '分批數', width: 100, cellTemplate: $templateCache.get('deliveryJobsShowDelivery') },
                { name: 'AML_TOTAL_NUM'   ,  displayName: '總袋數', width: 100 },
                // { name: 'ITEM_LIST'          ,  displayName: '報機單', enableFiltering: false, width: '8%', cellTemplate: $templateCache.get('accessibilityToOperaForJob001') },
                // { name: 'FLIGHT_ITEM_LIST'   ,  displayName: '銷艙單', enableFiltering: false, width: '8%', cellTemplate: $templateCache.get('accessibilityToOperaForJob002') },
                { name: 'DELIVERY_ITEM_LIST' ,  displayName: '派送單', enableFiltering: false, width: '8%', cellTemplate: $templateCache.get('accessibilityToOperaForJob003') },
                { name: 'Options'       , displayName: '操作', width: 65, enableCellEdit: false, enableFiltering: false, cellTemplate: $templateCache.get('accessibilityToM') }
            ],
            enableFiltering: true,
            enableSorting: false,
            enableColumnMenus: false,
            // enableVerticalScrollbar: false,
            paginationPageSizes: [10, 25, 50, 100],
            paginationPageSize: 100,
            onRegisterApi: function(gridApi){
                $vm.deliveryItemGridApi = gridApi;
            }
        }
    });

    function LoadDeliveryItem(){
        RestfulApi.SearchMSSQLData({
            querymain: 'deliveryJobs',
            queryname: 'SelectDeliveryItem',
            params: {
                U_ID : $vm.profile.U_ID,
                U_GRADE : $vm.profile.U_GRADE
                // DEPTS : $vm.profile.DEPTS
            }
        }).then(function (res){
            console.log(res["returnData"]);
            $vm.deliveryItemData = res["returnData"];
        });
    };

})
.controller('deliveryJobsShowApaccsDetailCtrl', function ($uibModalInstance, item, vmData) {
    var $ctrl = this;

    $ctrl.MdInit = function(){
        $ctrl.item = item;
        $ctrl.mdData = vmData;
    }

    $ctrl.mdDataOptions = {
        data:  '$ctrl.mdData',
        columnDefs: [
            { name: 'AML_NO'             , displayName: 'NO' },
            { name: 'AML_TOTAL_NUM'      , displayName: '主提單總件數' },
            { name: 'AML_DELIVERY_NUM'   , displayName: '分批件數' },
            { name: 'AML_CUMULATIVE_NUM' , displayName: '累計件數' },
            { name: 'AML_DELIVERY_MASK'  , displayName: '分批註記' },
            { name: 'AML_TRAN_CUST'      , displayName: '傳送海關' },
            { name: 'AML_MF_NOT_MATCH'   , displayName: '主併不符' },
            { name: 'AML_FMASK'          , displayName: '併裝註記' },
            { name: 'AML_ITEM_CODE'      , displayName: '貨棧代號' },
            { name: 'AML_LOAD_PLACE'     , displayName: '裝貨地' },
            { name: 'AML_DOWN_PLACE'     , displayName: '卸貨地' },
            { name: 'AML_DESCTINATION'   , displayName: '目的地' },
            { name: 'AML_5108'           , displayName: '5108' },
            { name: 'AML_FWB_MASK'       , displayName: 'FWB註記' }
        ],
        enableFiltering: true,
        enableSorting: true,
        enableColumnMenus: false,
        multiSelect: false,
        // enableVerticalScrollbar: false,
        paginationPageSizes: [10, 25, 50, 100],
        paginationPageSize: 100,
        onRegisterApi: function(gridApi){
            $ctrl.mdDataGridApi = gridApi;
        }
    }

    $ctrl.ok = function() {
        $uibModalInstance.close();
    };

    $ctrl.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
});