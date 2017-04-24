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
                        OL_SEQ : 'AdminTest20170418195141'
                    };
                }
                
                LoadFlightItemList();
            // }
        },
        profile : Session.Get(),
        defaultChoice : 'Left',
        job002Options : {
            data: '$vm.job002Data',
            columnDefs: [
                { name: 'Index'         , displayName: '序列', width: 50, enableCellEdit: false, enableFiltering: false},
                { name: 'FLL_ITEM'         , displayName: '' },
                { name: 'FLL_BAGNO'    , displayName: '袋號' },
                { name: 'FLL_CTN'    , displayName: '件數' },
                { name: 'FLL_WEIGHT'     , displayName: '重量' },
                { name: 'FLL_DESCRIPTION' , displayName: '品名' },
                { name: 'FLL_DECLAREDNO'        , displayName: '宣告序號' },
                { name: 'FLL_REMARK'      , displayName: '備註' }
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

});