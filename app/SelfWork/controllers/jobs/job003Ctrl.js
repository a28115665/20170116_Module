"use strict";

angular.module('app.selfwork').controller('Job003Ctrl', function ($scope, $stateParams, $state, AuthApi, Session, toaster, $uibModal, $templateCache, RestfulApi, uiGridConstants, $filter, $q, ToolboxApi) {
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
            }
        },
        job003Options : {
            data: '$vm.job003Data',
            columnDefs: [
                // { name: 'EML_SORT_KEY'       , displayName: '序號', width: 50 },
                { name: 'EML_DECL_NO'        , displayName: '報單號碼', width: 125 },
                { name: 'EML_DECL_TYPE'      , displayName: '報單類別', width: 91 },
                { name: 'IL_BAGNO_NOREPEAT'  , displayName: '併袋號碼', width: 91 },
                { name: 'IL_SMALLNO2'        , displayName: '分提單號', width: 110 },
                { name: 'EML_CLEARANCE_TYPE2' , displayName: '通關方式', width: 91 },
                { name: 'EML_PIECE'          , displayName: '申報件數', width: 91 },
                { name: 'EML_GCI_PIECE'      , displayName: '進倉件數', width: 91 },
                { name: 'EML_GCO_PIECE'      , displayName: '出倉件數', width: 91 },
                { name: 'EML_WEIGHT'         , displayName: '申報重量', width: 91 },
                { name: 'EML_GCI_WEIGHT'     , displayName: '進倉重量', width: 91 },
                { name: 'EML_BAG_WEIGHT'     , displayName: '袋重', width: 65 },
                { name: 'EML_CLEARANCE_TYPE_STR' , displayName: '真實貨態', width: 91 },
                { name: 'CC_CUST_CLEARANCE'  , displayName: '行家貨態', width: 91 },
                { name: 'EML_BAG_FEE'        , displayName: '倉租費用', width: 91 },
                { name: 'EML_FLIGHT_NO'      , displayName: '航班', width: 65 },
                { name: 'EML_FLIGHT_DATE'    , displayName: '班機日期', width: 91, cellFilter: 'dateFilter' },
                { name: 'EML_GCI_DATE1'      , displayName: '進倉時間', width: 91, cellFilter: 'dateFilter' },
                { name: 'EML_GCO_DATE1'      , displayName: '出倉時間', width: 91, cellFilter: 'dateFilter' },
                { name: 'EML_RELEASE_TIME'   , displayName: '放行時間', width: 145, cellFilter: 'datetimeFilter' },
                { name: 'CC_ORI_DESC'        , displayName: '真實備註', width: 91 },
                { name: 'CC_CUST_DESC'       , displayName: '行家備註', width: 91 },
                { name: 'Options'            , displayName: '操作', width: 65, enableCellEdit: false, enableFiltering: false, cellTemplate: $templateCache.get('accessibilityToM'), pinnedRight:true }
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
                $vm.job003GridApi = gridApi;

                // gridApi.rowEdit.on.saveRow($scope, $vm.Update);
            }
        },
        ExportExcel: function(){
            var _exportName = $filter('date')($vm.vmData.OL_IMPORTDT, 'yyyyMMdd', 'GMT') + ' ' + 
                              $filter('compyFilter')($vm.vmData.OL_CO_CODE) + ' ' + 
                              $vm.vmData.OL_FLIGHTNO;

            ToolboxApi.ExportExcelBySql({
                templates : 4,
                filename : _exportName,
                querymain: 'job003',
                queryname: 'SelectDeliveryItemList',
                params: {
                    OL_MASTER : $vm.vmData.OL_MASTER,
                    OL_IMPORTDT : $filter('date')($vm.vmData.OL_IMPORTDT, 'yyyy-MM-dd', 'GMT'),
                    OL_FLIGHTNO : $vm.vmData.OL_FLIGHTNO,
                    OL_COUNTRY : $vm.vmData.OL_COUNTRY,                
                    DIL_SEQ: $vm.vmData.OL_SEQ
                }
            }).then(function (res) {
                // console.log(res);
            });
        },
        SyncClearance: function(){
            RestfulApi.SearchMSSQLData({
                querymain: 'job003',
                queryname: 'SyncClearance',
                params: {
                    IL_SEQ: $vm.vmData.OL_SEQ
                }
            }).then(function (res){
                var _data = res["returnData"] || [];

                if(_data.length == 0){
                    toaster.pop('info', '訊息', '無分提單號可同步。', 3000);
                    return;
                }

                // var modalInstance = $uibModal.open({
                //     animation: true,
                //     ariaLabelledBy: 'modal-title',
                //     ariaDescribedBy: 'modal-body',
                //     templateUrl: 'pullGoodsModalContent.html',
                //     controller: 'PullGoodsModalInstanceCtrl',
                //     controllerAs: '$ctrl',
                //     // windowClass: 'my-xl-modal-window',
                //     backdrop: 'static',
                //     // size: 'lg',
                //     // appendTo: parentElem,
                //     resolve: {
                //         data: function() {
                //             return _data;
                //         }
                //     }
                // });

                // modalInstance.result.then(function(selectedItem) {
                //     // console.log(selectedItem);

                //     if(selectedItem.length > 0){
                //         var _getSelectedRows = angular.copy(selectedItem);

                //         modalInstance = $uibModal.open({
                //             animation: true,
                //             ariaLabelledBy: 'modal-title',
                //             ariaDescribedBy: 'modal-body',
                //             templateUrl: 'pullGoodsDescModalContent.html',
                //             controller: 'PullGoodsDescModalInstanceCtrl',
                //             controllerAs: '$ctrl',
                //             backdrop: 'static',
                //             // size: 'lg',
                //             // appendTo: parentElem,
                //             resolve: {
                //                 vmData: function() {
                //                     return {};
                //                 }
                //             }
                //         });

                //         modalInstance.result.then(function(selectedItem) {
                //             // console.log(selectedItem);

                //             var _bagNo = [];

                //             for(var i in _getSelectedRows){
                //                 if(_getSelectedRows[i].IL_BAGNO.length != 8){
                //                     toaster.pop('warning', '警告', '序列'+_getSelectedRows[i].Index+'的袋號異常，拉貨中止。', 3000);
                //                     return;
                //                 }

                //                 _bagNo.push(_getSelectedRows[i].IL_BAGNO);
                //             }

                //             var _task = [];

                //             for(var i in _bagNo){

                //                 _task.push({
                //                     crudType: 'Insert',
                //                     table: 19,
                //                     params: {
                //                         PG_SEQ         : $vm.vmData.OL_SEQ,
                //                         PG_BAGNO       : _bagNo[i],
                //                         PG_REASON      : selectedItem.PG_REASON,
                //                         PG_CR_USER     : $vm.profile.U_ID,
                //                         PG_CR_DATETIME : $filter('date')(new Date, 'yyyy-MM-dd HH:mm:ss')
                //                     }
                //                 });

                //             }

                //             RestfulApi.CRUDMSSQLDataByTask(_task).then(function (res){

                //                 if(res["returnData"].length > 0){
                //                     LoadItemList();
                //                 }
                //             });

                //         }, function() {
                //             // $log.info('Modal dismissed at: ' + new Date());
                //         });
                //     }

                // }, function() {
                //     // $log.info('Modal dismissed at: ' + new Date());
                // });
            })
        },
        ProblemClearance: function(){
            console.log(456);
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

});