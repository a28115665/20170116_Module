"use strict";

angular.module('app.selfwork').controller('Job001Ctrl', function ($scope, $stateParams, $state, AuthApi, Session, toaster, $uibModal, $templateCache, RestfulApi) {
    // console.log($stateParams, $state);

    var $vm = this;

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
            },
            //通報前線人員
            alertData : function(row){
                console.log(row);
            }
        },
        job001Options : {
            data: '$vm.job001Data',
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
                $vm.job001GridApi = gridApi;
                // $vm.editorOrderGridApi.grid.registerRowsProcessor(function ( renderableRows ){
                //     var matcher = new RegExp($vm.filterValue);
                //     renderableRows.forEach(function(row) {
                //         var match = false;
                //         ['b', 'c', 'm', 'n', 'o'].forEach(function(field) {
                //             if (row.entity[field].match(matcher)) {
                //                 match = true;
                //             }
                //         });
                //         if (!match) {
                //             row.visible = false;
                //         }
                //     });
                //     return renderableRows;
                // }, 200);
                
                gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue){
                    // $scope.msg.lastCellEdited = 'edited row id:' + rowEntity.id + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue ;
                    console.log('edited row id:' + rowEntity.id + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue);
                    $scope.$apply();
                });
            }
        },
        ExportExcel: function(){

        },
        CancelNo: function(){
            if($vm.job001GridApi.selection.getSelectedRows().length > 0){
                for(var i in $vm.job001GridApi.selection.getSelectedRows()){
                    var _index = $vm.job001GridApi.selection.getSelectedRows()[i].Index;
                    $vm.job001Data[_index-1].IL_MERGENO = null;
                }
            }
        },
        MergeNo: function(){
            // console.log($vm.job001GridApi.selection.getSelectedRows());
            if($vm.job001GridApi.selection.getSelectedRows().length > 0){
                // 取得第一個袋號當併票號
                var _MergeNo = $vm.job001GridApi.selection.getSelectedRows()[0].IL_BAGNO;

                for(var i in $vm.job001GridApi.selection.getSelectedRows()){
                    var _index = $vm.job001GridApi.selection.getSelectedRows()[i].Index;
                    $vm.job001Data[_index-1].IL_MERGENO = _MergeNo;
                }
            }
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
                    job001Data: function() {
                        return $vm.job001Data;
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
            querymain: 'job001',
            queryname: 'SelectItemList',
            params: {
                IL_SEQ: $vm.vmData.OL_SEQ
            }
        }).then(function (res){
            // console.log(res["returnData"]);
            for(var i=0;i<res["returnData"].length;i++){
                res["returnData"][i]["Index"] = i+1;
            }
            $vm.job001Data = res["returnData"];
        }).finally(function() {
            HandleWindowResize($vm.job001GridApi);
        }); 
    };

    function ReturnToEmployeejobsPage(){
        $state.transitionTo($state.current.parent);
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
.controller('MergeNoResultModalInstanceCtrl', function ($uibModalInstance, job001Data, uiGridGroupingConstants) {
    var $ctrl = this;
    $ctrl.items = job001Data;

    $ctrl.MdInit = function(){
        DoMergeNoSplit();
        // console.log($ctrl.job001DataHaveMergeNo);
        // console.log($ctrl.job001DataNotMergeNo);
    };

    $ctrl.HandleWindowResize = function(pGridApi){
        HandleWindowResize(pGridApi);
    }

    $ctrl.job001DataHaveMergeNoOption = {
        data: '$ctrl.job001DataHaveMergeNo',
        columnDefs: [
            { name: 'Index',        displayName: '序列', width: 50},
            { name: 'IL_G1',        displayName: '報關種類', width: 154 },
            { name: 'IL_MERGENO',        displayName: '併票號', width: 129, grouping: { groupPriority: 0 } },
            { name: 'IL_BAGNO',        displayName: '袋號', width: 129 },
            { name: 'IL_SMALLNO',        displayName: '小號', width: 115 },
            { name: 'IL_NATURE',        displayName: '品名', width: 115 },
            { name: 'IL_NATURE_NEW',        displayName: '新品名', width: 115 },
            { name: 'IL_CTN',        displayName: '件數', width: 115, treeAggregationType: uiGridGroupingConstants.aggregation.SUM, customTreeAggregationFinalizerFn: function( aggregation ) {
                    aggregation.rendered = aggregation.value;
                }
            },
            { name: 'IL_PLACE',        displayName: '產地', width: 115 },
            { name: 'IL_WEIGHT',        displayName: '重量', width: 115, treeAggregationType: uiGridGroupingConstants.aggregation.SUM, customTreeAggregationFinalizerFn: function( aggregation ) {
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
            $ctrl.job001DataHaveMergeNoGridApi = gridApi;
            HandleWindowResize($ctrl.job001DataHaveMergeNoGridApi);
        }
    };

    $ctrl.job001DataNotMergeNoOption = {
        data: '$ctrl.job001DataNotMergeNo',
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
            $ctrl.job001DataNotMergeNoGridApi = gridApi;
            HandleWindowResize($ctrl.job001DataNotMergeNoGridApi);
        }
    }

    function DoMergeNoSplit(){
        $ctrl.job001DataHaveMergeNo = [];
        $ctrl.job001DataNotMergeNo = [];

        for(var i in job001Data){
            if(job001Data[i].IL_MERGENO){
                $ctrl.job001DataHaveMergeNo.push(job001Data[i]);
            }else{
                $ctrl.job001DataNotMergeNo.push(job001Data[i]);
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