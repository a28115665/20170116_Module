"use strict";

angular.module('app.selfwork').controller('StatisticalCnsCtrl', function ($scope, $stateParams, $state, AuthApi, Session, toaster, $uibModal, $templateCache, RestfulApi, $filter, uiGridConstants, localStorageService, ToolboxApi) {
    
    var $vm = this;

	angular.extend(this, {
        Init : function(){
            // console.log(localStorageService.get("StatisticalCns"));
            
            // 帶入LocalStorage資料
            if(localStorageService.get("StatisticalCns") == null){
                $vm.vmData = {};
            }else{
                $vm.vmData = localStorageService.get("StatisticalCns");

                SearchData();
            }
        },
        profile : Session.Get(),
        gridMethod : {
            detail : function(row){
                console.log(row);

                RestfulApi.SearchMSSQLData({
                    querymain: 'statisticalCns',
                    queryname: 'SelectCnsDetail',
                    params: {
                        CI_ID : row.entity.CI_ID,
                        CUSTINFO_QUERY_FROM : $vm._params.CUSTINFO_QUERY_FROM,
                        CUSTINFO_QUERY_TOXX : $vm._params.CUSTINFO_QUERY_TOXX
                    }
                }).then(function (res){
                    console.log(res["returnData"]);

                    var _vmData = res["returnData"] || [];

                    var modalInstance = $uibModal.open({
                        animation: true,
                        ariaLabelledBy: 'modal-title',
                        ariaDescribedBy: 'modal-body',
                        templateUrl: 'statisticalCnsDetail.html',
                        controller: 'statisticalCnsDetailCtrl',
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
        resultOptions : {
            data:  '$vm.resultData',
            columnDefs: [
                { name: 'CI_ID'             ,  displayName: '帳號' },
                { name: 'CI_NAME'           ,  displayName: '行家名稱' },
                { name: 'QU_TOTAL_COUNT'    ,  displayName: '查詢總數量' },
                { name: 'QU_REPEAT_COUNT'   ,  displayName: '查詢重複的數量' },
                { name: 'QU_TRADEVAN_COUNT' ,  displayName: '向關貿查詢的數量' },
                { name: 'Options'           ,  displayName: '功能', enableFiltering: false, width: 65, cellTemplate: $templateCache.get('StatisticalCnsDetail') }
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
        Search : function(){
            // console.log($vm.vmData);
            $vm.resultData = [];

            if(IsConditionsHaveValue($vm.vmData)){
                SearchData();
            }else{
                toaster.pop('info', '訊息', '請輸入查詢條件', 3000);
            }
        },
        ExportExcel : function(){

            var _exportName = $filter('date')(new Date(), 'yyyyMMdd') + ' ' + $scope.getWord($state.current.data.title) + '結果';

            ToolboxApi.ExportExcelBySql({
                templates : 31,
                filename : _exportName,
                querymain: 'statisticalCns',
                queryname: 'SelectCns',
                params: $vm._params
            }).then(function (res) {
                // console.log(res);
            });
        }
    });

    function SearchData () {
        $vm._params = {};

        $vm._params = CombineConditions($vm.vmData);
        // 紀錄查詢條件
        localStorageService.set("StatisticalCns", $vm.vmData);
        
        console.log($vm._params);

        RestfulApi.SearchMSSQLData({
            querymain: 'statisticalCns',
            queryname: 'SelectCns',
            params: $vm._params
        }).then(function (res){
            console.log(res["returnData"]);
            
            $vm.resultData = [];
            if(res["returnData"].length > 0){
                $vm.resultData = res["returnData"];
            }else{
                toaster.pop('info', '訊息', '查無資料', 3000);
            }
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

    /**
     * CombineConditions 條件組合
     * @param {[type]}
     */
    function CombineConditions(pObject){
        var _conditions = {};

        for(var i in pObject){
            if(pObject[i] != null){
                if(pObject[i].toString() != ""){
                    if(i == "CUSTINFO_QUERY_FROM"){
                        _conditions[i] = pObject[i] + ' 00:00:00';
                    }else if(i == "CUSTINFO_QUERY_TOXX"){
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
        localStorageService.remove("StatisticalCns");
        $vm.vmData = {};
    }

})
.controller('statisticalCnsDetailCtrl', function ($uibModalInstance, item, vmData, $templateCache) {
    var $ctrl = this;

    $ctrl.MdInit = function(){
        $ctrl.item = item;
        $ctrl.mdData = vmData;
    }

    $ctrl.mdDataOptions = {
        data:  '$ctrl.mdData',
        columnDefs: [
            { name: 'Name'    , displayName: '姓名', cellTooltip: cellTooltip },
            { name: 'ID'      , displayName: '證件號碼', cellTooltip: cellTooltip },
            { name: 'Tel'     , displayName: '電話', cellTooltip: cellTooltip },
            { name: 'result1' , displayName: '姓名與身份證號比對結果', cellTooltip: cellTooltip },
            { name: 'result2' , displayName: '經通知辦理實名認證名單比對結果', cellTooltip: cellTooltip },
            { name: 'result3' , displayName: '實名認證比對結果', cellTooltip: cellTooltip }
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