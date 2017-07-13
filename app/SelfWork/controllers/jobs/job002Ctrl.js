"use strict";

angular.module('app.selfwork').controller('Job002Ctrl', function ($scope, $stateParams, $state, AuthApi, Session, toaster, $uibModal, $templateCache, RestfulApi, uiGridConstants, $filter, $q, ToolboxApi) {
    // console.log($stateParams, $state);

    var $vm = this,
        cellClassEditabled = [];

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
                
                LoadFlightItemList();
            }
        },
        profile : Session.Get(),
        defaultChoice : 'Left',
        job002Options : {
            data: '$vm.job002Data',
            columnDefs: [
                // { name: 'Index'           , displayName: '序列', width: 50, enableCellEdit: false, enableFiltering: false, headerCellClass: 'text-muted'},
                { name: 'FLL_ITEM'        , displayName: '序號', enableCellEdit: false },
                { name: 'BAGNO_MATCH'     , displayName: '內貨', enableCellEdit: false, cellTemplate: $templateCache.get('accessibilityToInternalGoods') },
                { name: 'FLL_BAGNO'       , displayName: '袋號', headerCellClass: 'text-primary' },
                { name: 'FLL_CTN'         , displayName: '件數', headerCellClass: 'text-primary' },
                { name: 'FLL_WEIGHT'      , displayName: '重量', headerCellClass: 'text-primary' },
                { name: 'FLL_DESCRIPTION' , displayName: '品名', headerCellClass: 'text-primary' },
                { name: 'FLL_DECLAREDNO'  , displayName: '宣告序號', headerCellClass: 'text-primary' },
                { name: 'FLL_REMARK'      , displayName: '備註', headerCellClass: 'text-primary' }
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
                $vm.job002GridApi = gridApi;

                // gridApi.rowEdit.on.saveRow($scope, $vm.Update);
            }
        },
        ExportExcel: function(){
            var _exportName = $filter('date')($vm.vmData.OL_IMPORTDT, 'yyyyMMdd') + ' ' + 
                              $filter('compyFilter')($vm.vmData.OL_CO_CODE) + ' ' + 
                              $vm.vmData.OL_FLIGHTNO;

            ToolboxApi.ExportExcelBySql({
                templates : 5,
                filename : _exportName,
                querymain: 'job002',
                queryname: 'SelectFlightItemList',
                params: {
                    OL_MASTER : $vm.vmData.OL_MASTER,
                    OL_IMPORTDT : $filter('date')($vm.vmData.OL_IMPORTDT, 'yyyy-MM-dd'),
                    OL_FLIGHTNO : $vm.vmData.OL_FLIGHTNO,
                    OL_COUNTRY : $vm.vmData.OL_COUNTRY,                
                    FLL_SEQ: $vm.vmData.OL_SEQ
                }
            }).then(function (res) {
                // console.log(res);
            });
        },
        Return : function(){
            ReturnToEmployeejobsPage();
        },
        Update : function(entity){
            // create a fake promise - normally you'd use the promise returned by $http or $resource
            var promise = $q.defer();
            $vm.job002GridApi.rowEdit.setSavePromise( entity, promise.promise );
         
            RestfulApi.UpdateMSSQLData({
                updatename: 'Update',
                table: 10,
                params: {
                    // FLL_ITEM         : entity.FLL_ITEM,
                    FLL_BAGNO        : entity.FLL_BAGNO,
                    FLL_CTN          : entity.FLL_CTN,
                    FLL_WEIGHT       : entity.FLL_WEIGHT,
                    FLL_DESCRIPTION  : entity.FLL_DESCRIPTION,
                    FLL_DECLAREDNO   : entity.FLL_DECLAREDNO,
                    FLL_REMARK       : entity.FLL_REMARK
                },
                condition: {
                    FLL_SEQ         : entity.FLL_SEQ,
                    FLL_IL_NEWBAGNO : entity.FLL_IL_NEWBAGNO
                }
            }).then(function (res) {
                promise.resolve();
            }, function (err) {
                toaster.pop('danger', '錯誤', '更新失敗', 3000);
                promise.reject();
            });
        }
    });

    function LoadFlightItemList(){
        RestfulApi.SearchMSSQLData({
            querymain: 'job002',
            queryname: 'SelectFlightItemList',
            params: {
                FLL_SEQ: $vm.vmData.OL_SEQ
            }
        }).then(function (res){
            console.log(res["returnData"]);
            // for(var i=0;i<res["returnData"].length;i++){
            //     res["returnData"][i]["Index"] = i+1;
            // }
            $vm.job002Data = res["returnData"];
        }).finally(function() {
            HandleWindowResize($vm.job002GridApi);
        }); 
    };

    function ReturnToEmployeejobsPage(){
        $state.transitionTo($state.current.parent);
    };

});