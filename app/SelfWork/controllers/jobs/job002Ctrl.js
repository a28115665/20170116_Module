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
                //         OL_SEQ : 'Co0001Co000120170712205825'
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
                { name: 'BAGNO_MATCH'     , displayName: '內貨', enableCellEdit: false, cellTemplate: $templateCache.get('accessibilityToInternalGoods'), filter: 
                    {
                        term: null,
                        type: uiGridConstants.filter.SELECT,
                        selectOptions: [
                            {label:'否', value: '0'},
                            {label:'是', value: '1'}
                        ]
                    }
                },
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

                gridApi.rowEdit.on.saveRow($scope, $vm.Update);
            }
        },
        EditorRemark: function(){

            RestfulApi.SearchMSSQLData({
                querymain: 'job002',
                queryname: 'SelectRemark',
                params: {               
                    FLL_SEQ: $vm.vmData.OL_SEQ
                }
            }).then(function (res){
                console.log(res["returnData"]);
            
                var modalInstance = $uibModal.open({
                    animation: true,
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    templateUrl: 'editorRemarkModalContent.html',
                    controller: 'EditorRemarkModalInstanceCtrl',
                    controllerAs: '$ctrl',
                    // size: 'sm',
                    // appendTo: parentElem,
                    resolve: {
                        items: function() {
                            return res["returnData"];
                        }
                    }
                });

                modalInstance.result.then(function(selectedItem) {

                    console.log(selectedItem);

                    var _tasks = [];

                    _tasks.push({
                        crudType: 'Delete',
                        table: 28,
                        params: {
                            FLLR_SEQ : $vm.vmData.OL_SEQ
                        }
                    })

                    for(var i in selectedItem){
                        _tasks.push({
                            crudType: 'Insert',
                            table: 28,
                            params: {
                                FLLR_SEQ         : $vm.vmData.OL_SEQ,
                                FLLR_ROWINDEX    : i,
                                FLLR_REMARK      : selectedItem[i].text,
                                FLLR_CR_USER     : $vm.profile.U_ID,
                                FLLR_CR_DATETIME : $filter('date')(new Date, 'yyyy-MM-dd HH:mm:ss')
                            }
                        })
                    }

                    RestfulApi.CRUDMSSQLDataByTask(_tasks).then(function (res){
                        if(res["returnData"].length > 0){

                            toaster.pop('success', '訊息', '底部編輯成功', 3000);
                        }
                    }, function (err) {
                        toaster.pop('danger', '錯誤', '底部編輯失敗', 3000);
                    });

                }, function() {
                    // $log.info('Modal dismissed at: ' + new Date());
                });
            }); 
        },
        ExportExcel: function(){

            var _exportName = $filter('date')($vm.vmData.OL_IMPORTDT, 'yyyyMMdd') + ' ' + 
                              $filter('compyFilter')($vm.vmData.OL_CO_CODE) + ' ' + 
                              $vm.vmData.OL_FLIGHTNO,
                _totalBag = 0,
                _totalWeight = 0;

            // 計算件數和重量
            for(var i in $vm.job002Data){
                _totalBag += $vm.job002Data[i].FLL_CTN;
                _totalWeight += $vm.job002Data[i].FLL_WEIGHT;
            }

            ToolboxApi.ExportExcelByMultiSql([
                {
                    templates      : 5,
                    filename       : _exportName,
                    OL_MASTER      : $vm.vmData.OL_MASTER,
                    OL_IMPORTDT    : $filter('date')($vm.vmData.OL_IMPORTDT, 'yyyy-MM-dd'),
                    OL_FLIGHTNO    : $vm.vmData.OL_FLIGHTNO,
                    OL_COUNTRY     : $vm.vmData.OL_COUNTRY, 
                    OL_TEL         : $vm.vmData.OL_TEL, 
                    OL_FAX         : $vm.vmData.OL_FAX, 
                    OL_TOTALBAG    : _totalBag, 
                    OL_TOTALWEIGHT : _totalWeight
                },
                {
                    crudType: 'Select',
                    querymain: 'job002',
                    queryname: 'SelectFlightItemList',
                    params: {               
                        FLL_SEQ: $vm.vmData.OL_SEQ
                    }
                },
                {
                    crudType: 'Select',
                    querymain: 'job002',
                    queryname: 'SelectRemark',
                    params: {               
                        FLL_SEQ: $vm.vmData.OL_SEQ
                    }
                }
            ]).then(function (res) {
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

})
.controller('EditorRemarkModalInstanceCtrl', function ($uibModalInstance, items) {
    var $ctrl = this;

    $ctrl.Init = function(){
        $ctrl.mdData = [];

        for(var i in items){
            $ctrl.mdData.push({
                id : i,
                text : items[i].FLLR_REMARK
            });
        }
    }

    $ctrl.ok = function() {
        $uibModalInstance.close($ctrl.mdData);
    };

    $ctrl.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
});