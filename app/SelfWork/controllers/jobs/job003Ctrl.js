"use strict";

angular.module('app.selfwork').controller('Job003Ctrl', function ($scope, $stateParams, $state, AuthApi, Session, toaster, $uibModal, $templateCache, RestfulApi, uiGridConstants, $filter) {
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
                //         OL_SEQ : 'AdminTest20170418195141'
                //     };
                // }
                
                LoadFlightItemList();
            }
        },
        profile : Session.Get(),
        defaultChoice : 'Left',
        job003Options : {
            data: '$vm.job003Data',
            columnDefs: [
                { name: 'Index'         , displayName: '序列', width: 50, enableCellEdit: false, enableFiltering: false},
                { name: 'DIL_DRIVER'         , displayName: '司機' },
                { name: 'DIL_BAGNO'    , displayName: '袋號' },
                { name: 'DIL_ORDERNO'    , displayName: '提單號' },
                { name: 'DIL_BARCODE'     , displayName: '條碼號' },
                { name: 'DIL_CTN' , displayName: '件數' },
                { name: 'DIL_WEIGHT'        , displayName: '重量' },
                { name: 'DIL_GETNAME'      , displayName: '收件人公司' },
                { name: 'DIL_GETADDRESS'     , displayName: '收件地址' },
                { name: 'DIL_GETTEL' , displayName: '收件人電話' },
                { name: 'DIL_INCOME'        , displayName: '代收款' },
                { name: 'DIL_REMARK'      , displayName: '備註' }
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
                $vm.job003GridApi = gridApi;
            }
        },
        ExportExcel: function(){

        },
        Return : function(){
            ReturnToEmployeejobsPage();
        },
        Update : function(){

        }
    });

    function LoadFlightItemList(){
        RestfulApi.SearchMSSQLData({
            querymain: 'job003',
            queryname: 'SelectDeliveryItemList',
            params: {
                DIL_SEQ: $vm.vmData.OL_SEQ
            }
        }).then(function (res){
            console.log(res["returnData"]);
            for(var i=0;i<res["returnData"].length;i++){
                res["returnData"][i]["Index"] = i+1;
            }
            $vm.job003Data = res["returnData"];
        }).finally(function() {
            HandleWindowResize($vm.job003GridApi);
        }); 
    };

    function ReturnToEmployeejobsPage(){
        $state.transitionTo($state.current.parent);
    };

});