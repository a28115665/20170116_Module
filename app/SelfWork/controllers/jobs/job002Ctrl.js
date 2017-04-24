"use strict";

angular.module('app.selfwork').controller('Job002Ctrl', function ($scope, $stateParams, $state, AuthApi, Session, toaster, $uibModal, $templateCache, RestfulApi, uiGridConstants, $filter) {
    // console.log($stateParams, $state);

    var $vm = this,
        cellClassEditabled = [];

    angular.extend(this, {
        Init : function(){
            // 不正常登入此頁面
            // if($stateParams.data == null){
            //     ReturnToEmployeejobsPage();
            // }else{
                $vm.vmData = $stateParams.data;

                // 測試用
                if($vm.vmData == null){
                    $vm.vmData = {
                        OL_SEQ : 'AdminTest20170419101047'
                    };
                }
                
                LoadItemList();
            // }
        },
        profile : Session.Get(),
        defaultChoice : 'Left',
        gridMethod : {
            changeNature : function(row){
                console.log(row);
            },
            //加入黑名單
            banData : function(row){
                console.log(row);
                var modalInstance = $uibModal.open({
                    animation: true,
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    templateUrl: 'myModalContent.html',
                    controller: 'ModalInstanceCtrl',
                    controllerAs: '$ctrl',
                    // size: 'lg',
                    // appendTo: parentElem,
                    resolve: {
                        items: function() {
                            return row.entity;
                        }
                    }
                });

                modalInstance.result.then(function(selectedItem) {
                    // $ctrl.selected = selectedItem;
                }, function() {
                    // $log.info('Modal dismissed at: ' + new Date());
                });
            }
        },
        job002Options : {
            data: '$vm.job002Data',
            columnDefs: [
                { name: 'Index'         , displayName: '序列', width: 50, enableFiltering: false},
                { name: 'IL_G1'         , displayName: '報關種類', width: 154 },
                { name: 'IL_MERGENO'    , displayName: '併票號', width: 129, enableCellEdit: false },
                { name: 'IL_BAGNO'      , displayName: '袋號', width: 129 },
                { name: 'IL_SMALLNO'    , displayName: '小號', width: 115 },
                { name: 'IL_NATURE'     , displayName: '品名', width: 115 },
                { name: 'IL_NATURE_NEW' , displayName: '新品名', width: 115 },
                { name: 'IL_CTN'        , displayName: '件數', width: 115 },
                { name: 'IL_PLACE'      , displayName: '產地', width: 115 },
                { name: 'IL_WEIGHT'     , displayName: '重量', width: 115 },
                { name: 'IL_WEIGHT_NEW' , displayName: '更改後重量', width: 115 },
                { name: 'IL_PCS'        , displayName: '數量', width: 115 },
                { name: 'IL_UNIT'       , displayName: '單位', width: 115 },
                { name: 'IL_GETNO'      , displayName: '收件者統編', width: 115 },
                { name: 'IL_SENDNAME'   , displayName: '寄件人或公司', width: 115 },
                { name: 'IL_GETNAME'    , displayName: '收件人公司', width: 115 },
                { name: 'IL_GETADDRESS' , displayName: '收件地址', width: 300 },
                { name: 'IL_GETTEL'     , displayName: '收件電話', width: 115 },
                { name: 'IL_UNIVALENT'  , displayName: '單價', width: 115 },
                { name: 'IL_FINALCOST'  , displayName: '完稅價格', width: 115 },
                { name: 'IL_TAX'        , displayName: '稅則', width: 115 },
                { name: 'IL_TRCOM'      , displayName: '派送公司', width: 115 },
                { name: 'Options'       , displayName: '操作', width: 160, enableCellEdit: false, enableFiltering: false, cellTemplate: $templateCache.get('accessibilityToCB'), pinnedRight:true }
            ],
            enableFiltering: true,
            enableSorting: true,
            enableColumnMenus: false,
            // enableVerticalScrollbar: false,
		    enableRowSelection: true,
    		enableSelectAll: true,
            paginationPageSizes: [50, 100, 150, 200, 250, 300],
            paginationPageSize: 50,
            onRegisterApi: function(gridApi){
                $vm.job002GridApi = gridApi;
            }
        },
        ExportExcel: function(){

        },
        Return : function(){
            ReturnToEmployeejobsPage();
        },
        Update : function(){

        },
        MergeNoResult : function(){
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'mergeNoResultModalContent.html',
                controller: 'MergeNoResultModalInstanceCtrl',
                controllerAs: '$ctrl',
                size: 'lg',
                // appendTo: parentElem,
                resolve: {
                    job002Data: function() {
                        return $vm.job002Data;
                    }
                }
            });

            modalInstance.result.then(function(selectedItem) {
                // $ctrl.selected = selectedItem;
            }, function() {
                // $log.info('Modal dismissed at: ' + new Date());
            });
        }
    });

    function LoadItemList(){
        RestfulApi.SearchMSSQLData({
            querymain: 'job002',
            queryname: 'SelectFlightItemList',
            params: {
                FLL_SEQ: $vm.vmData.OL_SEQ
            }
        }).then(function (res){
            console.log(res["returnData"]);
            for(var i=0;i<res["returnData"].length;i++){
                res["returnData"][i]["Index"] = i+1;
            }
            $vm.job002Data = res["returnData"];
        }).finally(function() {
            HandleWindowResize($vm.job002GridApi);
        }); 
    };

    function ReturnToEmployeejobsPage(){
        $state.transitionTo($state.current.parent);
    };

})
.controller('MergeNoModalInstanceCtrl', function ($uibModalInstance, mergeNo, natureNew) {
    var $ctrl = this;
    $ctrl.natureNew = natureNew;

    $ctrl.mdData = {
        mergeNo : mergeNo,
        natureNew : null
    };

    $ctrl.Init = function(){
        $ctrl.mergeNoChoice = '1';
    };

    $ctrl.ok = function() {
        $uibModalInstance.close($ctrl.mdData);
    };

    $ctrl.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
})
.controller('ModalInstanceCtrl', function ($uibModalInstance, items) {
    var $ctrl = this;
    $ctrl.items = items;
    $ctrl.selected = {
        item: $ctrl.items[0]
    };

    $ctrl.ok = function() {
        $uibModalInstance.close($ctrl.selected.item);
    };

    $ctrl.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
})
.controller('MergeNoResultModalInstanceCtrl', function ($uibModalInstance, job002Data, uiGridGroupingConstants) {
    var $ctrl = this;
    $ctrl.items = job002Data;

    $ctrl.MdInit = function(){
        DoMergeNoSplit();
        // console.log($ctrl.job002DataHaveMergeNo);
        // console.log($ctrl.job002DataNotMergeNo);
    };

    $ctrl.HandleWindowResize = function(pGridApi){
        HandleWindowResize(pGridApi);
    }

    $ctrl.job002DataHaveMergeNoOption = {
        data: '$ctrl.job002DataHaveMergeNo',
        columnDefs: [
            { name: 'Index',        displayName: '序列', width: 50},
            { name: 'IL_G1',        displayName: '報關種類', width: 154 },
            { name: 'IL_MERGENO',        displayName: '併票號', width: 129, grouping: { groupPriority: 0 } },
            { name: 'IL_BAGNO',        displayName: '袋號', width: 129 },
            { name: 'IL_SMALLNO',        displayName: '小號', width: 115 },
            { name: 'IL_NATURE',        displayName: '品名', width: 115 },
            { name: 'IL_NATURE_NEW',        displayName: '新品名', width: 115, treeAggregationType: uiGridGroupingConstants.aggregation.MAX, 
                customTreeAggregationFinalizerFn: function( aggregation ) {
                    aggregation.rendered = aggregation.value;
                }
            },
            { name: 'IL_CTN',        displayName: '件數', width: 115, treeAggregationType: uiGridGroupingConstants.aggregation.SUM, 
                customTreeAggregationFinalizerFn: function( aggregation ) {
                    aggregation.rendered = aggregation.value;
                }
            },
            { name: 'IL_PLACE',        displayName: '產地', width: 115 },
            { name: 'IL_WEIGHT',        displayName: '重量', width: 115, treeAggregationType: uiGridGroupingConstants.aggregation.SUM, 
                customTreeAggregationFinalizerFn: function( aggregation ) {
                    // console.log(aggregation);
                    aggregation.rendered = aggregation.value;
                }
            },
            { name: 'IL_WEIGHT_NEW',        displayName: '更改後重量', width: 115 },
            { name: 'IL_PCS',        displayName: '數量', width: 115 },
            { name: 'IL_UNIT',        displayName: '單位', width: 115 },
            { name: 'IL_GETNO',        displayName: '收件者統編', width: 115 },
            { name: 'IL_SENDNAME',        displayName: '寄件人或公司', width: 115 },
            { name: 'IL_GETNAME',        displayName: '收件人公司', width: 115 },
            { name: 'IL_GETADDRESS',        displayName: '收件地址', width: 300 },
            { name: 'IL_GETTEL',        displayName: '收件電話', width: 115 },
            { name: 'IL_UNIVALENT',        displayName: '單價', width: 115 },
            { name: 'IL_FINALCOST',        displayName: '完稅價格', width: 115 },
            { name: 'IL_TAX',        displayName: '稅則', width: 115 },
            { name: 'IL_TRCOM',        displayName: '派送公司', width: 115 }
        ],
        enableFiltering: false,
        enableSorting: true,
        enableColumnMenus: false,
        groupingShowCounts: false,
        // enableVerticalScrollbar: false,
        paginationPageSizes: [50, 100, 150, 200, 250, 300],
        paginationPageSize: 50,
        onRegisterApi: function(gridApi){
            $ctrl.job002DataHaveMergeNoGridApi = gridApi;
            HandleWindowResize($ctrl.job002DataHaveMergeNoGridApi);
        }
    };

    $ctrl.job002DataNotMergeNoOption = {
        data: '$ctrl.job002DataNotMergeNo',
        columnDefs: [
            { name: 'Index',        displayName: '序列', width: 50},
            { name: 'IL_G1',        displayName: '報關種類', width: 154 },
            { name: 'IL_MERGENO',        displayName: '併票號', width: 129 },
            { name: 'IL_BAGNO',        displayName: '袋號', width: 129 },
            { name: 'IL_SMALLNO',        displayName: '小號', width: 115 },
            { name: 'IL_NATURE',        displayName: '品名', width: 115 },
            { name: 'IL_NATURE_NEW',        displayName: '新品名', width: 115 },
            { name: 'IL_CTN',        displayName: '件數', width: 115 },
            { name: 'IL_PLACE',        displayName: '產地', width: 115 },
            { name: 'IL_WEIGHT',        displayName: '重量', width: 115 },
            { name: 'IL_WEIGHT_NEW',        displayName: '更改後重量', width: 115 },
            { name: 'IL_PCS',        displayName: '數量', width: 115 },
            { name: 'IL_UNIT',        displayName: '單位', width: 115 },
            { name: 'IL_GETNO',        displayName: '收件者統編', width: 115 },
            { name: 'IL_SENDNAME',        displayName: '寄件人或公司', width: 115 },
            { name: 'IL_GETNAME',        displayName: '收件人公司', width: 115 },
            { name: 'IL_GETADDRESS',        displayName: '收件地址', width: 300 },
            { name: 'IL_GETTEL',        displayName: '收件電話', width: 115 },
            { name: 'IL_UNIVALENT',        displayName: '單價', width: 115 },
            { name: 'IL_FINALCOST',        displayName: '完稅價格', width: 115 },
            { name: 'IL_TAX',        displayName: '稅則', width: 115 },
            { name: 'IL_TRCOM',        displayName: '派送公司', width: 115 }
        ],
        enableFiltering: false,
        enableSorting: true,
        enableColumnMenus: false,
        // enableVerticalScrollbar: false,
        paginationPageSizes: [50, 100, 150, 200, 250, 300],
        paginationPageSize: 50,
        onRegisterApi: function(gridApi){
            $ctrl.job002DataNotMergeNoGridApi = gridApi;
            HandleWindowResize($ctrl.job002DataNotMergeNoGridApi);
        }
    }

    function DoMergeNoSplit(){
        $ctrl.job002DataHaveMergeNo = [];
        $ctrl.job002DataNotMergeNo = [];

        for(var i in job002Data){
            if(job002Data[i].IL_MERGENO){
                $ctrl.job002DataHaveMergeNo.push(job002Data[i]);
            }else{
                $ctrl.job002DataNotMergeNo.push(job002Data[i]);
            }
        }
    }

    $ctrl.ok = function() {
        $uibModalInstance.close($ctrl.selected.item);
    };

    $ctrl.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
});