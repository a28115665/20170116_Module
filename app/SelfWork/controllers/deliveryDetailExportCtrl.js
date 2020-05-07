"use strict";

angular.module('app.selfwork').controller('DeliveryDetailExportCtrl', function ($scope, $stateParams, $state, AuthApi, Session, toaster, $uibModal, $templateCache, RestfulApi, $filter, compy, clearanceType, uiGridConstants, localStorageService, ToolboxApi) {
    
    var $vm = this;

	angular.extend(this, {
        Init : function(){
            // console.log(localStorageService.get("DeliveryDetailExport"));
            
            // 帶入LocalStorage資料
            if(localStorageService.get("DeliveryDetailExport") == null){
                $vm.vmData = {};
            }else{
                $vm.vmData = localStorageService.get("DeliveryDetailExport");
            }
        },
        profile : Session.Get(),
        compyData : compy,
        clearanceTypeData : clearanceType,
        loading : {
            exportExcel : false
        },
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
            // 貨物查看
            viewOrder : function(row){
                OrderStatus.Get(row)
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
            },
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
            releaseData : function(row) {

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
                                title : "是否解單"
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
                            OL_FDATETIME2 : null,
                            OL_FUSER2     : null
                        },
                        condition: {
                            OL_SEQ : selectedItem.OL_SEQ
                        }
                    }).then(function (res) {

                        toaster.pop('success', '訊息', '解單成功。', 3000);
                        SearchData();
                    });

                }, function() {
                    // $log.info('Modal dismissed at: ' + new Date());
                });

            }
        },
        gridMethodForJob003 : {
            // 檢視
            viewData : function(row){
                $state.transitionTo("app.selfwork.deliveryhistorysearch.resultjob003", {
                    data: row.entity
                });
            },
        },
        resultOptions : {
            data:  '$vm.resultData',
            columnDefs: [
                { name: 'OL_IMPORTDT' ,  displayName: '進口日期', width: 91, cellFilter: 'dateFilter' },
                { name: 'OL_REAL_IMPORTDT' ,  displayName: '報機日期', width: 91, cellFilter: 'dateFilter', cellTooltip: function (row, col) 
                    {
                        return '真實報機日期：' + $filter('dateFilter')(row.entity.OL_CR_DATETIME)
                    } 
                },
                { name: 'CO_NAME'     ,  displayName: '行家', width: 80 },
                { name: 'OL_FLIGHTNO' ,  displayName: '航班', width: 80 },
                { name: 'OL_MASTER'   ,  displayName: '主號', width: 110, cellTemplate: $templateCache.get('accessibilityToMasterForViewOrder') },
                { name: 'OL_COUNTRY'  ,  displayName: '起運國別', width: 90 },
                { name: 'OL_REASON'   ,  displayName: '描述', cellTooltip: cellTooltip },
                { name: 'AML_DELIVERY'   ,  displayName: '分批數', width: 77, cellTemplate: $templateCache.get('deliveryJobsShowDelivery') },
                { name: 'AML_TOTAL_NUM'   ,  displayName: '總袋數', width: 77 },
                { name: 'C1'   ,  displayName: '清出(袋數)', width: 86 },
                { name: 'OtherC1'   ,  displayName: '非清出(袋數)', width: 86 },
                { name: 'CCOtherC1ByCount'   ,  displayName: '行家非清出(件數)', width: 86 },
                { name: 'CCOtherC1ByBagno'   ,  displayName: '行家非清出(袋數)', width: 86 },
                { name: 'ITEM_LIST' ,  displayName: '日報明細', enableFiltering: false, width: 86, cellTemplate: $templateCache.get('accessibilityToOperaForJob003') },
                { name: 'Options'   , displayName: '操作', width: 92, enableCellEdit: false, enableFiltering: false, cellTemplate: $templateCache.get('deliveryHistorysearchToMC') }
            ],
            enableFiltering: true,
            enableSorting: false,
            enableColumnMenus: false,
            // enableVerticalScrollbar: false,
            paginationPageSizes: [10, 25, 50, 100],
            paginationPageSize: 100,
            onRegisterApi: function(gridApi){
                $vm.resultGridApi = gridApi;
            }
        },
        Cancel : function(){
            ClearSearchCondition();
        },
        // Search : function(){
        //     // console.log($vm.vmData);
        //     $vm.resultData = [];

        //     if(IsConditionsHaveValue($vm.vmData)){
        //         if(IsValidOfConditions($vm.vmData)){
        //             SearchData();
        //         }
        //     }else{
        //         toaster.pop('info', '訊息', '請輸入匯出條件', 3000);
        //     }
        // },
        ExportExcel : function(){

            if(IsConditionsHaveValue($vm.vmData)){
                if(IsValidOfConditions($vm.vmData)){
                    ExportData();
                }
            }else{
                toaster.pop('info', '訊息', '請輸入匯出條件', 3000);
            }
        }
    });

    function ExportData () {

        $vm.loading.exportExcel = true;

        $vm._params = {};

        $vm._params = CombineConditions($vm.vmData);
        // 紀錄查詢條件
        localStorageService.set("DeliveryDetailExport", $vm.vmData);
        
        console.log($vm._params);

        ToolboxApi.ExportExcelBySql({
            templates : 30,
            filename : $filter('date')(new Date(), 'yyyyMMdd') + ' ' + $scope.getWord($state.current.data.title),
            querymain: 'deliveryDetailExport',
            queryname: 'ExportJob003',
            params: {
                EXPORT_DATE : $filter('date')(new Date(), 'M月dd日', 'GMT'),
                IMPORTDT_FROM  : $vm._params.IMPORTDT_FROM,
                IMPORTDT_TOXX  : $vm._params.IMPORTDT_TOXX,
                OL_CO_CODE     : $vm._params.OL_CO_CODE,
                MASTER_START   : $vm._params.MASTER_START,
                MASTER_END     : $vm._params.MASTER_END,
                GCI_DATE1_FROM : $vm._params.GCI_DATE1_FROM,
                GCI_DATE1_TOXX : $vm._params.GCI_DATE1_TOXX,
                IL_BAGNO       : $vm._params.IL_BAGNO,
                EML_TRUE_CLEARANCE : $vm._params.EML_TRUE_CLEARANCE
            }
        }).then(function (res) {
            // console.log(res);
            $vm.loading.exportExcel = false;
        });
    }

    /**
     * IsConditionsHaveValue 檢查查詢條件是否為空
     * @param {[type]} true 表示有值, false 表示空值
     */
    function IsConditionsHaveValue(pObject){
        var _result = true,
            _isClear = true;

        if(pObject == {}){
            _result = false;
        }else{
            // 檢查所有值是否都是空的
            for(var i in pObject){
                if(pObject[i] != null){
                    if(pObject[i].toString() != ""){
                        _isClear = false;
                        break;
                    }
                }
            }

            // 如果都是空的 回傳false
            if(_isClear){
                _result = false;
            }
        }

        return _result;
    }

    function IsValidOfConditions(pObject){
        var _result = true;

        if(moment(pObject["IMPORTDT_TOXX"]).diff(moment(pObject["IMPORTDT_FROM"]), 'days') > 7){
            _result = false;
            toaster.pop('warning', '警告', '進口日期不可超過7天', 3000);
        }
        if(moment(pObject["GCI_DATE1_TOXX"]).diff(moment(pObject["GCI_DATE1_FROM"]), 'days') > 7){
            _result = false;
            toaster.pop('warning', '警告', '進倉時間不可超過7天', 3000);
        }

        return _result;
    }

    /**
     * CombineConditions 條件組合
     * @param {[type]}
     */
    function CombineConditions(pObject){
        var _conditions = {};

        for(var i in pObject){
            if(pObject[i] != null){
                if(pObject[i].toString() != ""){
                    if(i == "CRDT_FROM"){
                        _conditions[i] = pObject[i] + ' 00:00:00';
                    }else if(i == "CRDT_TOXX"){
                        _conditions[i] = pObject[i] + ' 23:59:59';
                    }else{
                        _conditions[i] = pObject[i];
                    }
                }
            }
        }

        return _conditions;
    }

    /**
     * [ClearSearchCondition description] 清除查詢條件
     */
    function ClearSearchCondition(){
        localStorageService.remove("DeliveryDetailExport");
        $vm.vmData = {};
    }

});