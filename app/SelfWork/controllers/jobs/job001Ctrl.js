"use strict";

angular.module('app.selfwork').controller('Job001Ctrl', function ($scope, $stateParams, $state, AuthApi, Session, toaster, $uibModal, $templateCache, RestfulApi, ToolboxApi, uiGridConstants, $filter, $q) {
    // console.log($stateParams, $state);

    var $vm = this,
        cellClassEditabled = [];

    angular.extend(this, {
        Init : function(){
            // 不正常登入此頁面
            if($stateParams.data == null){
                ReturnToEmployeejobsPage();
            }else{
                $vm.vmData = $stateParams.data;

                // 測試用
                // if($vm.vmData == null){
                //     $vm.vmData = {
                //         OL_SEQ : 'AdminTest20170525190758'
                //     };
                // }
                
                LoadItemList();
            }
        },
        profile : Session.Get(),
        defaultChoice : 'Left',
        gridMethod : {
            // 改單
            changeNature : function(row){
                console.log(row);
                
                row.entity.loading = true;
                ToolboxApi.ChangeNature({
                    ID : $vm.profile.U_ID,
                    PW : $vm.profile.U_PW,
                    NATURE : row.entity.IL_NATURE
                }).then(function (res) {
                    row.entity.IL_NATURE_NEW = res["returnData"];
                }).finally(function() {
                    row.entity.loading = false;
                });
            },
            // 加入黑名單
            banData : function(row){
                console.log(row);
                var modalInstance = $uibModal.open({
                    animation: true,
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    templateUrl: 'opAddBanModalContent.html',
                    controller: 'OPAddBanModalInstanceCtrl',
                    controllerAs: '$ctrl',
                    // size: 'lg',
                    // appendTo: parentElem,
                    resolve: {
                        vmData: function() {
                            return row.entity;
                        }
                    }
                });

                modalInstance.result.then(function(selectedItem) {
                    // $ctrl.selected = selectedItem;
                    console.log(selectedItem);
                    RestfulApi.InsertMSSQLData({
                        insertname: 'Insert',
                        table: 13,
                        params: {
                            BLFO_SEQ         : selectedItem.IL_SEQ,
                            BLFO_NEWBAGNO    : selectedItem.IL_NEWBAGNO,
                            BLFO_NEWSMALLNO  : selectedItem.IL_NEWSMALLNO,
                            BLFO_ORDERINDEX  : selectedItem.IL_ORDERINDEX,
                            BLFO_CR_USER     : $vm.profile.U_ID,
                            BLFO_CR_DATETIME : $filter('date')(new Date, 'yyyy-MM-dd HH:mm:ss')
                        }
                    }).then(function(res) {
                        // 加入後需要Disabled
                        row.entity.BLFO_TRACK = true;
                    });

                }, function() {
                    // $log.info('Modal dismissed at: ' + new Date());
                });
            },
            // 拉貨
            pullGoods : function(row){
                console.log(row.entity);
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
                                title : "是否拉貨"
                            };
                        }
                    }
                });

                modalInstance.result.then(function(selectedItem) {
                    // $ctrl.selected = selectedItem;
                    console.log(selectedItem);
                    
                    RestfulApi.InsertMSSQLData({
                        insertname: 'Insert',
                        table: 19,
                        params: {
                            PG_SEQ         : selectedItem.IL_SEQ,
                            PG_BAGNO       : selectedItem.IL_BAGNO,
                            PG_CR_USER     : $vm.profile.U_ID,
                            PG_CR_DATETIME : $filter('date')(new Date, 'yyyy-MM-dd HH:mm:ss')
                        }
                    }).then(function (res) {
                        for(var i in $vm.job001Data){
                            if($vm.job001Data[i].IL_BAGNO == selectedItem.IL_BAGNO){
                                $vm.job001Data[i].PG_PULLGOODS = true;
                            }
                        }
                        // LoadItemList();
                    });

                }, function() {
                    // $log.info('Modal dismissed at: ' + new Date());
                });
            },
            // // 取消拉貨
            // cancelPullGoods : function(row){
            //     console.log(row.entity);
            //     var modalInstance = $uibModal.open({
            //         animation: true,
            //         ariaLabelledBy: 'modal-title',
            //         ariaDescribedBy: 'modal-body',
            //         template: $templateCache.get('isChecked'),
            //         controller: 'IsCheckedModalInstanceCtrl',
            //         controllerAs: '$ctrl',
            //         size: 'sm',
            //         windowClass: 'center-modal',
            //         // appendTo: parentElem,
            //         resolve: {
            //             items: function() {
            //                 return row.entity;
            //             },
            //             show: function(){
            //                 return {};
            //             }
            //         }
            //     });

            //     modalInstance.result.then(function(selectedItem) {
            //         // $ctrl.selected = selectedItem;
            //         console.log(selectedItem);
                    
            //         RestfulApi.DeleteMSSQLData({
            //             deletename: 'Delete',
            //             table: 19,
            //             params: {
            //                 PG_SEQ         : selectedItem.IL_SEQ,
            //                 PG_BAGNO       : selectedItem.IL_BAGNO
            //             }
            //         }).then(function (res) {
            //             LoadItemList();
            //         });

            //     }, function() {
            //         // $log.info('Modal dismissed at: ' + new Date());
            //     });
            // }
        },
        job001Options : {
            data: '$vm.job001Data',
            columnDefs: [
                { name: 'Index'         , displayName: '序列', width: 50, enableFiltering: false, enableCellEdit: false, headerCellClass: 'text-muted' },
                { name: 'IL_G1'         , displayName: '報關種類', width: 154, enableCellEdit: false, headerCellClass: 'text-muted' },
                { name: 'IL_MERGENO'    , displayName: '併票號', width: 129, enableCellEdit: false },
                { name: 'IL_BAGNO'      , displayName: '袋號', width: 129 },
                { name: 'IL_SMALLNO'    , displayName: '小號', width: 115 },
                { name: 'IL_NATURE'     , displayName: '品名', width: 115 },
                { name: 'IL_NATURE_NEW' , displayName: '新品名', width: 115 },
                { name: 'IL_CTN'        , displayName: '件數', width: 115 },
                { name: 'IL_PLACE'      , displayName: '產地', width: 115 },
                { name: 'IL_NEWPLACE'   , displayName: '新產地', width: 115 },
                { name: 'IL_WEIGHT'     , displayName: '重量', width: 115 },
                { name: 'IL_WEIGHT_NEW' , displayName: '更改後重量', width: 115 },
                { name: 'IL_PCS'        , displayName: '數量', width: 115 },
                { name: 'IL_NEWPCS'     , displayName: '新數量', width: 115 },
                { name: 'IL_UNIT'       , displayName: '單位', width: 115 },
                { name: 'IL_NEWUNIT'    , displayName: '新單位', width: 115 },
                { name: 'IL_GETNO'      , displayName: '收件者統編', width: 115 },
                { name: 'IL_SENDNAME'   , displayName: '寄件人或公司', width: 115 },
                { name: 'IL_NEWSENDNAME', displayName: '新寄件人或公司', width: 115 },
                { name: 'IL_GETNAME'    , displayName: '收件人公司', width: 115 },
                { name: 'IL_GETADDRESS' , displayName: '收件地址', width: 300 },
                { name: 'IL_GETTEL'     , displayName: '收件電話', width: 115 },
                { name: 'IL_UNIVALENT'  , displayName: '單價', width: 115 },
                { name: 'IL_FINALCOST'  , displayName: '完稅價格', width: 115 },
                { name: 'IL_TAX'        , displayName: '稅則', width: 115 },
                { name: 'IL_TRCOM'      , displayName: '派送公司', width: 115 },
                { name: 'Options'       , displayName: '操作', width: 190, enableCellEdit: false, enableFiltering: false, cellTemplate: $templateCache.get('accessibilityToCB'), pinnedRight:true }
            ],
            // rowTemplate: '<div> \
            //                 <div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="row.entity.BLFO_TRACK != null ? \'cell-class-pull cell-class-ban\' : \'\'" ui-grid-cell></div> \
            //               </div>',
            rowTemplate: '<div> \
                            <div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{\'cell-class-ban\' : row.entity.BLFO_TRACK != null, \'cell-class-pull\' : row.entity.PG_PULLGOODS == true}" ui-grid-cell></div> \
                          </div>',
            enableFiltering: true,
            enableSorting: true,
            enableColumnMenus: false,
            // enableVerticalScrollbar: false,
		    enableRowSelection: true,
    		enableSelectAll: true,
            paginationPageSizes: [50, 100, 150, 200, 250, 300],
            paginationPageSize: 50,
            // rowEditWaitInterval: -1,
            onRegisterApi: function(gridApi){
                $vm.job001GridApi = gridApi;

                gridApi.rowEdit.on.saveRow($scope, $vm.Update);
            }
        },
        // 併票
        MergeNo: function(){
            // console.log($vm.job001GridApi.selection.getSelectedRows());
            if($vm.job001GridApi.selection.getSelectedRows().length > 0){
                // 取得第一個袋號當併票號
                var _mergeNo = $vm.job001GridApi.selection.getSelectedRows()[0].IL_BAGNO,
                    _natureNew = [];

                // 塞入新品名
                for(var i in $vm.job001GridApi.selection.getSelectedRows()){
                    // console.log($vm.job001GridApi.selection.getSelectedRows()[i].IL_NATURE_NEW);
                    if($vm.job001GridApi.selection.getSelectedRows()[i].IL_NATURE_NEW != null){
                        _natureNew.push($vm.job001GridApi.selection.getSelectedRows()[i].IL_NATURE_NEW);
                    }
                }
                var modalInstance = $uibModal.open({
                    animation: true,
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    templateUrl: 'mergeNoModalContent.html',
                    controller: 'MergeNoModalInstanceCtrl',
                    controllerAs: '$ctrl',
                    // size: 'lg',
                    // appendTo: parentElem,
                    resolve: {
                        mergeNo: function() {
                            return _mergeNo;
                        },
                        natureNew: function() {
                            return _natureNew;
                        }
                    }
                });

                modalInstance.result.then(function(selectedItem) {
                    // $ctrl.selected = selectedItem;
                    console.log(selectedItem);

                    // 變更併票號與新品名
                    for(var i in $vm.job001GridApi.selection.getSelectedRows()){
                        var _index = $vm.job001GridApi.selection.getSelectedRows()[i].Index;
                        $vm.job001Data[_index-1].IL_MERGENO = selectedItem.mergeNo;
                        $vm.job001Data[_index-1].IL_NATURE_NEW = selectedItem.natureNew;
                    }

                    $vm.job001GridApi.rowEdit.setRowsDirty($vm.job001GridApi.selection.getSelectedRows());
                    $vm.job001GridApi.selection.clearSelectedRows();
                }, function() {
                    // $log.info('Modal dismissed at: ' + new Date());
                });
            }
        },
        // 取消併票
        CancelNo: function(){
            if($vm.job001GridApi.selection.getSelectedRows().length > 0){
                for(var i in $vm.job001GridApi.selection.getSelectedRows()){
                    var _index = $vm.job001GridApi.selection.getSelectedRows()[i].Index;
                    $vm.job001Data[_index-1].IL_MERGENO = null;
                    // $vm.job001Data[_index-1].IL_NATURE_NEW = null;
                }

                $vm.job001GridApi.rowEdit.setRowsDirty($vm.job001GridApi.selection.getSelectedRows());
                $vm.job001GridApi.selection.clearSelectedRows();
            }
        },
        ExportExcel: function(){

        },
        // 顯示併票結果
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
        },
        // 顯示收件者相同結果
        RepeatName : function(){
            RestfulApi.SearchMSSQLData({
                querymain: 'job001',
                queryname: 'SelectRepeatName',
                params: {
                    IL_SEQ: $vm.vmData.OL_SEQ
                }
            }).then(function (res){
                // console.log(res["returnData"]);
                if(res["returnData"].length > 0){
                    var modalInstance = $uibModal.open({
                        animation: true,
                        ariaLabelledBy: 'modal-title',
                        ariaDescribedBy: 'modal-body',
                        templateUrl: 'repeatNameModalContent.html',
                        controller: 'RepeatNameModalInstanceCtrl',
                        controllerAs: '$ctrl',
                        size: 'lg',
                        // appendTo: parentElem,
                        resolve: {
                            repeatNameData: function() {
                                return res["returnData"];
                            }
                        }
                    });

                    modalInstance.result.then(function(selectedItem) {
                        // $ctrl.selected = selectedItem;
                    }, function() {
                        // $log.info('Modal dismissed at: ' + new Date());
                    });
                }else{
                    toaster.pop('info', '訊息', '無重複收件者名稱', 3000);
                }
            }); 
        },
        Return : function(){
            ReturnToEmployeejobsPage();
        },
        Update : function(entity){
            // console.log($vm.job001GridApi.rowEdit);
            // console.log($vm.job001GridApi.rowEdit.getDirtyRows($vm.job001GridApi.grid));

            // create a fake promise - normally you'd use the promise returned by $http or $resource
            var promise = $q.defer();
            $vm.job001GridApi.rowEdit.setSavePromise( entity, promise.promise );
         
            RestfulApi.UpdateMSSQLData({
                updatename: 'Update',
                table: 9,
                params: {
                    IL_G1          : entity.IL_G1,
                    IL_MERGENO     : entity.IL_MERGENO,
                    IL_BAGNO       : entity.IL_BAGNO,
                    IL_SMALLNO     : entity.IL_SMALLNO,
                    IL_NATURE      : entity.IL_NATURE,
                    IL_NATURE_NEW  : entity.IL_NATURE_NEW,
                    IL_CTN         : entity.IL_CTN,
                    IL_PLACE       : entity.IL_PLACE,
                    IL_NEWPLACE    : entity.IL_NEWPLACE,
                    IL_WEIGHT      : entity.IL_WEIGHT,
                    IL_WEIGHT_NEW  : entity.IL_WEIGHT_NEW,
                    IL_PCS         : entity.IL_PCS,
                    IL_NEWPCS      : entity.IL_NEWPCS,
                    IL_UNIT        : entity.IL_UNIT,
                    IL_NEWUNIT     : entity.IL_NEWUNIT,
                    IL_GETNO       : entity.IL_GETNO,
                    IL_SENDNAME    : entity.IL_SENDNAME,
                    IL_NEWSENDNAME : entity.IL_NEWSENDNAME,
                    IL_GETNAME     : entity.IL_GETNAME,
                    IL_GETADDRESS  : entity.IL_GETADDRESS,
                    IL_GETTEL      : entity.IL_GETTEL,
                    IL_UNIVALENT   : entity.IL_UNIVALENT,
                    IL_FINALCOST   : entity.IL_FINALCOST,
                    IL_TAX         : entity.IL_TAX,
                    IL_TRCOM       : entity.IL_TRCOM
                },
                condition: {
                    IL_SEQ        : entity.IL_SEQ,
                    IL_NEWBAGNO   : entity.IL_NEWBAGNO,
                    IL_NEWSMALLNO : entity.IL_NEWSMALLNO,
                    IL_ORDERINDEX : entity.IL_ORDERINDEX
                }
            }).then(function (res) {
                promise.resolve();
            }, function (err) {
                toaster.pop('danger', '錯誤', '更新失敗', 3000);
                promise.reject();
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
.controller('OPAddBanModalInstanceCtrl', function ($uibModalInstance, vmData) {
    var $ctrl = this;
    $ctrl.mdData = vmData;

    $ctrl.ok = function() {
        $uibModalInstance.close($ctrl.mdData);
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

    $ctrl.job001DataHaveMergeNoOption = {
        data: '$ctrl.job001DataHaveMergeNo',
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
            $ctrl.job001DataHaveMergeNoGridApi = gridApi;
            // HandleWindowResize($ctrl.job001DataHaveMergeNoGridApi);
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
            // HandleWindowResize($ctrl.job001DataNotMergeNoGridApi);
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
})
.controller('RepeatNameModalInstanceCtrl', function ($uibModalInstance, repeatNameData) {
    var $ctrl = this;
    $ctrl.mdData = repeatNameData;

    $ctrl.repeatNameOption = {
        data: '$ctrl.mdData',
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
            $ctrl.repeatNameGridApi = gridApi;
        }
    }

    $ctrl.ok = function() {
        $uibModalInstance.close($ctrl.mdData);
    };

    $ctrl.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
});