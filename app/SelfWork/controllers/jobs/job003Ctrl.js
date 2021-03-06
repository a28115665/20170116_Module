"use strict";

angular.module('app.selfwork').controller('Job003Ctrl', function ($scope, $stateParams, $state, AuthApi, Session, toaster, $uibModal, $templateCache, RestfulApi, uiGridConstants, $filter, $q, ToolboxApi, clearanceType, c3Type, bool) {
    // console.log($stateParams, $state);

    var $vm = this;

    angular.extend(this, {
        Init : function(){
            // 不正常登入此頁面
            if($stateParams.data == null){
                ReturnToEmployeejobsPage();
            }else{
                $vm.bigBreadcrumbsItems = $state.current.name.split(".");
                $vm.bigBreadcrumbsItems.shift();
                
                $vm.vmData = $stateParams.data;
                console.log($vm.vmData);
                // 測試用
                // if($vm.vmData == null){
                //     $vm.vmData = {
                //         OL_SEQ : 'AdminTest20170418195141'
                //     };
                // }
                
                LoadItemList();
            }
        },
        profile : Session.Get(),
        gridMethod : {
            // 各單的修改
            modifyData : function(row){
                console.log(row);

                var modalInstance = $uibModal.open({
                    animation: true,
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    templateUrl: 'job003ModifyDataModalContent.html',
                    controller: 'Job003ModifyDataInstanceCtrl',
                    controllerAs: '$ctrl',
                    // windowClass: 'my-xl-modal-window',
                    backdrop: 'static',
                    // size: 'lg',
                    // appendTo: parentElem,
                    resolve: {
                        vmData: function() {
                            return angular.copy(row.entity);
                        },
                        clearanceType: function() {
                            return clearanceType;
                        },
                        c3Type: function() {
                            return c3Type;
                        }
                    }
                });

                modalInstance.result.then(function(selectedItem) {
                    console.log(selectedItem);

                    // 自扣貨要補上自扣時間 且 出倉時間和放行時間都要清空
                    if(selectedItem.CC_CUST_CLEARANCE == 'B'){
                        selectedItem["CC_B_DATETIME"] = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
                        selectedItem["CC_GCO_DATE1"] = null;
                        selectedItem["CC_RELEASE_TIME"] = null;
                    }

                    if(selectedItem.CC_CR_USER){
                        RestfulApi.UpdateMSSQLData({
                            updatename: 'Update',
                            table: 50,
                            params: {
                                CC_CUST_CLEARANCE : selectedItem.CC_CUST_CLEARANCE,
                                CC_C3TYPE         : selectedItem.CC_C3TYPE,
                                CC_CUST_DESC      : selectedItem.CC_CUST_DESC,
                                CC_ORI_DESC       : selectedItem.CC_ORI_DESC,
                                CC_B_DATETIME     : selectedItem.CC_B_DATETIME,
                                CC_GCO_DATE1      : selectedItem.CC_GCO_DATE1,
                                CC_RELEASE_TIME   : selectedItem.CC_RELEASE_TIME,
                                CC_UP_USER        : $vm.profile.U_ID,
                                CC_UP_DATETIME    : $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')
                            },
                            condition: {
                                CC_SEQ        : selectedItem.IL_SEQ,
                                CC_NEWBAGNO   : selectedItem.IL_NEWBAGNO,
                                CC_NEWSMALLNO : selectedItem.IL_NEWSMALLNO,
                                CC_ORDERINDEX : selectedItem.IL_ORDERINDEX
                            }
                        }).then(function (res) {

                            if(res["returnData"] == 1){
                                toaster.pop('success', '訊息', '更新資料成功', 3000);
                            }else{
                                toaster.pop('error', '錯誤', '更新資料失敗', 3000);
                            }

                            LoadItemList();
                        });
                    }else{
                        RestfulApi.InsertMSSQLData({
                            insertname: 'Insert',
                            table: 50,
                            params: {
                                CC_SEQ        : selectedItem.IL_SEQ,
                                CC_NEWBAGNO   : selectedItem.IL_NEWBAGNO,
                                CC_NEWSMALLNO : selectedItem.IL_NEWSMALLNO,
                                CC_ORDERINDEX : selectedItem.IL_ORDERINDEX,
                                CC_CUST_CLEARANCE : selectedItem.CC_CUST_CLEARANCE,
                                CC_C3TYPE         : selectedItem.CC_C3TYPE,
                                CC_CUST_DESC      : selectedItem.CC_CUST_DESC,
                                CC_ORI_DESC       : selectedItem.CC_ORI_DESC,
                                CC_B_DATETIME     : selectedItem.CC_B_DATETIME,
                                CC_GCO_DATE1      : selectedItem.CC_GCO_DATE1,
                                CC_RELEASE_TIME   : selectedItem.CC_RELEASE_TIME,
                                CC_CR_USER        : $vm.profile.U_ID,
                                CC_CR_DATETIME    : $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')
                            }
                        }).then(function (res) {
                            
                            if(res["returnData"] == 1){
                                toaster.pop('success', '訊息', '更新資料成功', 3000);
                            }else{
                                toaster.pop('error', '錯誤', '更新資料失敗', 3000);
                            }

                            LoadItemList();
                        });
                    }

                }, function() {
                    // $log.info('Modal dismissed at: ' + new Date());
                });
            }
        },
        job003Options : {
            data: '$vm.job003Data',
            columnDefs: [
                { name: 'isEdited'          , displayName: '已編輯', width: 70, pinnedLeft:true, enableCellEdit: false, cellFilter: 'booleanFilter', filter: 
                    {
                        term: null,
                        type: uiGridConstants.filter.SELECT,
                        selectOptions: bool
                    }
                },
                { name: 'EML_DECL_NO'        , displayName: '報單號碼', width: 125 },
                { name: 'EML_DECL_TYPE'      , displayName: '報單類別', width: 91 },
                { name: 'IL_BAGNO2_NOREPEAT' , displayName: '併袋號碼', width: 91 },
                { name: 'IL_SMALLNO2'        , displayName: '分提單號', width: 110 },
                { name: 'EML_CLEARANCE_TYPE' , displayName: '通關方式', width: 91 },
                { name: 'EML_PIECE_NOREPEAT'          , displayName: '申報件數', width: 91 },
                { name: 'EML_GCI_PIECE_NOREPEAT'      , displayName: '進倉件數', width: 91 },
                { name: 'EML_GCO_PIECE_NOREPEAT'      , displayName: '出倉件數', width: 91 },
                { name: 'EML_WEIGHT_NOREPEAT'         , displayName: '申報重量', width: 91 },
                { name: 'EML_GCI_WEIGHT_NOREPEAT'     , displayName: '進倉重量', width: 91 },
                { name: 'EML_BAG_WEIGHT_NOREPEAT'     , displayName: '袋重', width: 65 },
                { name: 'EML_TRUE_CLEARANCE_STR' , displayName: '真實貨態', width: 91 },
                { name: 'CC_ORI_DESC'        , displayName: '真實備註', width: 91, headerCellClass: 'text-primary' },
                { name: 'EML_BAGNO_CLEARANCE_STR' , displayName: '袋號貨態', width: 91 },
                { name: 'CC_CUST_CLEARANCE_STR'  , displayName: '行家貨態', width: 91, headerCellClass: 'text-primary' },
                { name: 'CC_CUST_DESC'       , displayName: '行家備註', width: 91, headerCellClass: 'text-primary' },
                { name: 'EML_BAG_FEE_NOREPEAT'        , displayName: '倉租費用', width: 91 },
                { name: 'EML_FLIGHT_NO'      , displayName: '航班', width: 65 },
                { name: 'EML_FLIGHT_DATE'    , displayName: '班機日期', width: 91, cellFilter: 'dateFilter' },
                { name: 'EML_GCI_DATE1'      , displayName: '進倉時間', width: 91, cellFilter: 'dateFilter' },
                { name: 'EML_GCO_DATE1'      , displayName: '出倉時間', width: 91, cellFilter: 'dateFilter' },
                { name: 'EML_RELEASE_TIME'   , displayName: '放行時間', width: 145, cellFilter: 'datetimeFilter' },
                { name: 'CC_C3TYPE_STR'      , displayName: '貨態描述', width: 91, headerCellClass: 'text-primary' },
                { name: 'CC_GCO_DATE1'       , displayName: '行家出倉時間', width: 91, cellFilter: 'dateFilter', headerCellClass: 'text-primary' },
                { name: 'CC_RELEASE_TIME'    , displayName: '行家放行時間', width: 145, cellFilter: 'datetimeFilter', headerCellClass: 'text-primary' },
                { name: 'U_NAME'             , displayName: '編輯者', width: 91 },
                { name: 'CC_DATETIME'        , displayName: '修改時間', width: 145, cellFilter: 'datetimeFilter' },
                { name: 'Options'            , displayName: '操作', width: 65, enableCellEdit: false, enableFiltering: false, cellTemplate: $templateCache.get('accessibilityToM'), pinnedRight:true, cellClass: 'cell-class-no-style' }
            ],
            rowTemplate: '<div> \
                            <div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{\'cell-class-ban\' : ![\'C1\', null].includes(row.entity.EML_BAGNO_CLEARANCE), \'cell-class-pull\' : row.entity.CC_CR_USER }" ui-grid-cell></div> \
                          </div>',
            enableFiltering: true,
            enableSorting: true,
            enableColumnMenus: false,
            // enableVerticalScrollbar: false,
		    enableRowSelection: true,
    		enableSelectAll: true,
            paginationPageSizes: [50, 100, 150, 200, 250, 300],
            paginationPageSize: 100,
            onRegisterApi: function(gridApi){
                $vm.job003GridApi = gridApi;

                console.log($vm.job003GridApi);

                // setTimeout(function(){
                    // angular.element(document.getElementsByClassName('my-ui-grid')[0]).css('height', (3030 + 57 + 32) + 'px');
                // });

                // gridApi.rowEdit.on.saveRow($scope, $vm.Update);

                // gridApi.selection.on.rowSelectionChanged($scope, function(rowEntity, colDef, newValue, oldValue){
                //     rowEntity.entity["isEdited"] = rowEntity.isEdited;
                // });

                // gridApi.selection.on.rowSelectionChangedBatch($scope, function(rowEntity, colDef, newValue, oldValue){
                //     for(var i in rowEntity){
                //         rowEntity[i].entity["isEdited"] = rowEntity[i].isEdited;
                //     }
                // });
            }
        },
        ExportExcel: function(){

            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'job003ExcelMenu.html',
                controller: 'Job003ExcelMenuModalInstanceCtrl',
                controllerAs: '$ctrl',
                // scope: $scope,
                size: 'sm',
                // windowClass: 'center-modal',
                // appendTo: parentElem
            });

            modalInstance.result.then(function(selectedItem) {
                console.log(selectedItem);

                var _templates = null,
                    _exportName = $filter('date')($vm.vmData.OL_IMPORTDT, 'yyyyMMdd', 'GMT') + ' ' + 
                                  $filter('compyFilter')($vm.vmData.OL_CO_CODE) + ' ' + 
                                  $vm.vmData.OL_FLIGHTNO + ' ' +
                                  $vm.vmData.AML_TOTAL_NUM + '袋 ' +
                                  $vm.vmData.C1 + '袋' +
                                  $vm.vmData.OtherC1 + '袋',
                    _queryname = null,
                    _params = {         
                        EML_SEQ : $vm.vmData.OL_SEQ
                    };

                switch(selectedItem){
                    // 遠雄資料
                    case "Ehuftz":
                        _templates = "22";
                        _queryname = "SelectOriEhuftzMasterList";
                        break;
                    // 清關日報表
                    case "This":
                        _templates = "23";
                        _queryname = "SelectEhuftzMasterList";
                        break;
                }

                if(_queryname != null){

                    ToolboxApi.ExportExcelBySql({
                        templates : _templates,
                        filename : _exportName,
                        querymain: 'job003',
                        queryname: _queryname,
                        params: _params
                    }).then(function (res) {
                        // console.log(res);
                    
                        // $vm.vmData.TRADE_EXPORT += 1;

                        // RestfulApi.InsertMSSQLData({
                        //     insertname: 'Insert',
                        //     table: 33,
                        //     params: {
                        //         ILE_SEQ : $vm.vmData.OL_SEQ,
                        //         ILE_TYPE : selectedItem,
                        //         ILE_CR_DATETIME : $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                        //         ILE_CR_USER : $vm.profile.U_ID
                        //     }
                        // }).then(function (res) {
                            
                        // });
                    });
                }

            })

        },
        /**
         * [EhuftzData description] 遠雄資料
         */
        EhuftzData: function() {

            RestfulApi.SearchMSSQLData({
                querymain: 'job003',
                queryname: 'SelectOriEhuftzMasterList',
                params: {
                    EML_SEQ: $vm.vmData.OL_SEQ
                }
            }).then(function (res){
                var _data = res["returnData"] || [];

                if(_data.length == 0){
                    toaster.pop('info', '訊息', '查無遠雄資料。', 3000);
                    return;
                }

                var modalInstance = $uibModal.open({
                    animation: true,
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    templateUrl: 'ehuftzDataModalContent.html',
                    controller: 'EhuftzDataInstanceCtrl',
                    controllerAs: '$ctrl',
                    windowClass: 'my-xl-modal-window',
                    backdrop: 'static',
                    // size: 'lg',
                    // appendTo: parentElem,
                    resolve: {
                        data: function() {
                            return _data;
                        }
                    }
                });

                modalInstance.result.then(function(selectedItem) {

                }, function() {
                    // $log.info('Modal dismissed at: ' + new Date());
                });
            });
        },
        /**
         * [SyncClearance description] 貨態同步
         */
        SyncClearance: function(){

            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'syncClearanceModalContent.html',
                controller: 'SyncClearanceInstanceCtrl',
                controllerAs: '$ctrl',
                // windowClass: 'my-xl-modal-window',
                backdrop: 'static',
                // size: 'lg',
                // appendTo: parentElem,
                resolve: {
                    data: function() {
                        return $vm.job003Data;
                    }
                }
            });

            modalInstance.result.then(function(selectedItem) {
                console.log(selectedItem);

                if(selectedItem.length > 0){

                    var _task = [],
                        _params = {};

                    for(var i in selectedItem){

                        if(selectedItem[i].CC_CR_USER){
                            _params = {
                                CC_CUST_CLEARANCE : selectedItem[i].EML_TRUE_CLEARANCE,
                                CC_UP_USER        : $vm.profile.U_ID,
                                CC_UP_DATETIME    : $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')
                            }
                        }else{
                            _params = {
                                CC_CUST_CLEARANCE : selectedItem[i].EML_TRUE_CLEARANCE,
                                CC_CR_USER        : $vm.profile.U_ID,
                                CC_CR_DATETIME    : $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')
                            }
                        }

                        _task.push({
                            crudType: 'Upsert',
                            table: 50,
                            params: _params,
                            condition : {
                                CC_SEQ        : selectedItem[i].IL_SEQ,                                    
                                CC_NEWBAGNO   : selectedItem[i].IL_NEWBAGNO,
                                CC_NEWSMALLNO : selectedItem[i].IL_NEWSMALLNO,
                                CC_ORDERINDEX : selectedItem[i].IL_ORDERINDEX
                            }
                        });

                    }

                    RestfulApi.CRUDMSSQLDataByTask(_task).then(function (res){

                        if(res["returnData"].length > 0){
                            LoadItemList();
                        }
                    });

                }

            }, function() {
                // $log.info('Modal dismissed at: ' + new Date());
            });

        },
        ProblemClearance: function(){

            var problemClearance = $filter('filter')($vm.job003Data, { EML_BAGNO_CLEARANCE: '!C1' });

            if(problemClearance.length == 0){
                toaster.pop('info', '訊息', '無異常的貨態。', 3000);
                return;
            }

            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'problemClearanceModalContent.html',
                controller: 'ProblemClearanceInstanceCtrl',
                controllerAs: '$ctrl',
                // windowClass: 'my-xl-modal-window',
                backdrop: 'static',
                // size: 'lg',
                // appendTo: parentElem,
                resolve: {
                    data: function() {
                        return problemClearance;
                    }
                }
            });

            modalInstance.result.then(function(selectedItem) {

            }, function() {
                // $log.info('Modal dismissed at: ' + new Date());
            });
        },
        Return : function(){
            ReturnToEmployeejobsPage();
        },
        Update : function(entity){
            // create a fake promise - normally you'd use the promise returned by $http or $resource
            var promise = $q.defer();
            $vm.job003GridApi.rowEdit.setSavePromise( entity, promise.promise );
         
            RestfulApi.UpdateMSSQLData({
                updatename: 'Update',
                table: 11,
                params: {
                    DIL_DRIVER : entity.DIL_DRIVER,
                    DIL_BAGNO : entity.DIL_BAGNO,
                    DIL_ORDERNO : entity.DIL_ORDERNO,
                    DIL_BARCODE : entity.DIL_BARCODE,
                    DIL_CTN : entity.DIL_CTN,
                    DIL_WEIGHT : entity.DIL_WEIGHT,
                    DIL_GETNAME : entity.DIL_GETNAME,
                    DIL_GETADDRESS : entity.DIL_GETADDRESS,
                    DIL_GETTEL : entity.DIL_GETTEL,
                    DIL_INCOME : entity.DIL_INCOME,
                    DIL_REMARK : entity.DIL_REMARK
                },
                condition: {
                    DIL_SEQ           : entity.DIL_SEQ,
                    DIL_IL_NEWBAGNO   : entity.DIL_IL_NEWBAGNO,
                    DIL_IL_NEWSMALLNO : entity.DIL_IL_NEWSMALLNO
                }
            }).then(function (res) {
                promise.resolve();
            }, function (err) {
                toaster.pop('error', '錯誤', '更新失敗', 3000);
                promise.reject();
            });
        }
    });

    function LoadItemList(){

        RestfulApi.SearchMSSQLData({
            querymain: 'job003',
            queryname: 'SelectEhuftzMasterList',
            params: {
                EML_SEQ: $vm.vmData.OL_SEQ
            }
        }).then(function (res){
            console.log(res["returnData"]);

            var _data = res["returnData"] || [];

            // for(var i=0;i<res["returnData"].length;i++){
            //     res["returnData"][i]["Index"] = i+1;
            // }
            
            $vm.job003Data = _data;
        }); 
    };

    function ReturnToEmployeejobsPage(){
        $state.transitionTo($state.current.parent);
    };

})
.controller('Job003ExcelMenuModalInstanceCtrl', function ($uibModalInstance) {
    var $ctrl = this;
    
    $ctrl.ok = function(pType) {
        $uibModalInstance.close(pType);
    };

    $ctrl.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
})
.controller('EhuftzDataInstanceCtrl', function ($uibModalInstance, data) {
    var $ctrl = this;
    $ctrl.data = data;

    $ctrl.dataOption = {
        data: '$ctrl.data',
        columnDefs: [
            { name: 'EML_DECL_NO'        , displayName: '報單號碼', width: 125 },
            { name: 'EML_DECL_TYPE'      , displayName: '報單類別', width: 91 },
            { name: 'EML_EXP_BAGNO' , displayName: '併袋號碼', width: 91 },
            { name: 'EML_HWB'        , displayName: '分提單號', width: 110 },
            { name: 'EML_CLEARANCE_TYPE' , displayName: '通關方式', width: 91 },
            { name: 'EML_PIECE'          , displayName: '申報件數', width: 91 },
            { name: 'EML_GCI_PIECE'      , displayName: '進倉件數', width: 91 },
            { name: 'EML_GCO_PIECE'      , displayName: '出倉件數', width: 91 },
            { name: 'EML_WEIGHT'         , displayName: '申報重量', width: 91 },
            { name: 'EML_GCI_WEIGHT'     , displayName: '進倉重量', width: 91 },
            { name: 'EML_BAG_WEIGHT'     , displayName: '袋重', width: 65 },
            { name: 'EML_TRUE_CLEARANCE_STR' , displayName: '真實貨態', width: 91 },
            { name: 'EML_BAGNO_CLEARANCE_STR' , displayName: '袋號貨態', width: 91 },
            { name: 'EML_BAG_FEE'        , displayName: '倉租費用', width: 91 },
            { name: 'EML_FLIGHT_NO'      , displayName: '航班', width: 65 },
            { name: 'EML_FLIGHT_DATE'    , displayName: '班機日期', width: 91, cellFilter: 'dateFilter' },
            { name: 'EML_GCI_DATE1'      , displayName: '進倉時間', width: 91, cellFilter: 'dateFilter' },
            { name: 'EML_GCO_DATE1'      , displayName: '出倉時間', width: 91, cellFilter: 'dateFilter' },
            { name: 'EML_RELEASE_TIME'   , displayName: '放行時間', width: 145, cellFilter: 'datetimeFilter' },
            { name: 'EML_UP_DATETIME'   , displayName: '爬取時間', width: 145, cellFilter: 'datetimeFilter' }
        ],
        enableFiltering: true,
        enableSorting: true,
        enableColumnMenus: false,
        // enableVerticalScrollbar: false,
        paginationPageSizes: [50, 100, 150, 200, 250, 300],
        paginationPageSize: 100,
        onRegisterApi: function(gridApi){
            $ctrl.dataGridApi = gridApi;
        }
    }

    $ctrl.ok = function() {
        $uibModalInstance.close();
    };

    $ctrl.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
})
.controller('SyncClearanceInstanceCtrl', function ($uibModalInstance, data) {
    var $ctrl = this;
    $ctrl.data = data;

    $ctrl.dataOption = {
        data: '$ctrl.data',
        columnDefs: [
            { name: 'IL_BAGNO2_NOREPEAT' , displayName: '併袋號碼' },
            { name: 'IL_SMALLNO2'        , displayName: '分提單號' },
            { name: 'EML_TRUE_CLEARANCE_STR' , displayName: '真實貨態', width: 91 },
            { name: 'CC_CUST_CLEARANCE_STR' , displayName: '行家貨態', width: 91 }
        ],
        enableFiltering: true,
        enableSorting: true,
        enableColumnMenus: false,
        // enableVerticalScrollbar: false,
        enableRowSelection: true,
        enableSelectAll: true,
        paginationPageSizes: [50, 100, 150, 200, 250, 300],
        paginationPageSize: 100,
        onRegisterApi: function(gridApi){
            $ctrl.dataGridApi = gridApi;
        }
    }

    $ctrl.ok = function() {
        $uibModalInstance.close($ctrl.dataGridApi.selection.getSelectedRows());
    };

    $ctrl.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
})
.controller('ProblemClearanceInstanceCtrl', function ($uibModalInstance, data) {
    var $ctrl = this;
    $ctrl.data = data;

    $ctrl.dataOption = {
        data: '$ctrl.data',
        columnDefs: [
            { name: 'IL_BAGNO2_NOREPEAT' , displayName: '併袋號碼' },
            { name: 'IL_SMALLNO2'        , displayName: '分提單號' },
            { name: 'EML_TRUE_CLEARANCE_STR' , displayName: '真實貨態', width: 91 },
            { name: 'CC_CUST_CLEARANCE_STR' , displayName: '行家貨態', width: 91 }
        ],
        enableFiltering: true,
        enableSorting: true,
        enableColumnMenus: false,
        // enableVerticalScrollbar: false,
        paginationPageSizes: [50, 100, 150, 200, 250, 300],
        paginationPageSize: 100,
        onRegisterApi: function(gridApi){
            $ctrl.dataGridApi = gridApi;
        }
    }

    $ctrl.ok = function() {
        $uibModalInstance.close();
    };

    $ctrl.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
})
.controller('Job003ModifyDataInstanceCtrl', function ($uibModalInstance, vmData, clearanceType, c3Type) {
    var $ctrl = this;
    $ctrl.mdData = vmData;
    $ctrl.clearanceType = clearanceType;
    $ctrl.c3Type = c3Type;

    $ctrl.ok = function() {
        $uibModalInstance.close($ctrl.mdData);
    };

    $ctrl.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
});