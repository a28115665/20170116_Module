"use strict";

angular.module('app.concerns').controller('DailyAlertCtrl', function ($scope, $stateParams, $state, AuthApi, Session, toaster, $uibModal, $templateCache, $timeout, uiGridConstants, RestfulApi) {
    
    var $vm = this,
        columnDefs = [
            { name: 'IL_COUNT'      , displayName: '歷史歷程', width: 75, enableFiltering: false, cellTemplate: $templateCache.get('accessibilityToHistoryCount') },
            { name: 'BAN_TYPE'      , displayName: '名單類型', width: 100, filter: 
                {
                    term: "通報",
                    type: uiGridConstants.filter.SELECT,
                    selectOptions: [
                        {label:"通報", value:"通報"},
                        {label:"自訂", value:"自訂"}
                    ]
                }
            },
            { name: 'IL_G1'         , displayName: '報關種類', width: 154 },
            { name: 'IL_MERGENO'    , displayName: '併票號', width: 129 },
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
            { name: 'IL_TRCOM'      , displayName: '派送公司', width: 115 }
        ];

	angular.extend(this, {
        Init : function(){
            $scope.ShowTabs = true;
            $vm.LoadData();
            LoadILCount();
        },
        profile : Session.Get(),
        defaultTab : 'hr1',
        TabSwitch : function(pTabID){
            return pTabID == $vm.defaultTab ? 'active' : '';
        },
        LoadData : function(){
            console.log($vm.defaultTab);
            switch($vm.defaultTab){
                case 'hr1':
                    LoadCaseA();
                    break;
                case 'hr2':
                    LoadCaseB();
                    break;
                case 'hr3':
                    LoadCaseC();
                    break;
                case 'hr4':
                    LoadCaseD();
                    break;
            }
        },
        caseAOptions : {
            data:  '$vm.caseAData',
            columnDefs: columnDefs,
            enableFiltering: true,
            enableSorting: true,
            enableColumnMenus: false,
            // enableVerticalScrollbar: false,
            paginationPageSizes: [10, 25, 50],
            paginationPageSize: 10,
            onRegisterApi: function(gridApi){
                $vm.caseAGridApi = gridApi;
            }
        },
        caseBOptions : {
            data:  '$vm.caseBData',
            columnDefs: columnDefs,
            enableFiltering: true,
            enableSorting: true,
            enableColumnMenus: false,
            // enableVerticalScrollbar: false,
            paginationPageSizes: [10, 25, 50],
            paginationPageSize: 10,
            onRegisterApi: function(gridApi){
                $vm.caseBGridApi = gridApi;
            }
        },
        caseCOptions : {
            data:  '$vm.caseCData',
            columnDefs: columnDefs,
            enableFiltering: true,
            enableSorting: true,
            enableColumnMenus: false,
            // enableVerticalScrollbar: false,
            paginationPageSizes: [10, 25, 50],
            paginationPageSize: 10,
            onRegisterApi: function(gridApi){
                $vm.caseCGridApi = gridApi;
            }
        },
        caseDOptions : {
            data:  '$vm.caseDData',
            columnDefs: columnDefs,
            enableFiltering: true,
            enableSorting: true,
            enableColumnMenus: false,
            // enableVerticalScrollbar: false,
            paginationPageSizes: [10, 25, 50],
            paginationPageSize: 10,
            onRegisterApi: function(gridApi){
                $vm.caseDGridApi = gridApi;
            }
        }
    });

    function LoadILCount(){
        RestfulApi.CRUDMSSQLDataByTask([
            {
                crudType: 'Select',
                querymain: 'dailyAlert',
                queryname: 'SelectCaseACount'
            },
            {
                crudType: 'Select',
                querymain: 'dailyAlert',
                queryname: 'SelectCaseBCount'
            },
            {
                crudType: 'Select',
                querymain: 'dailyAlert',
                queryname: 'SelectCaseCCount'
            },
            {
                crudType: 'Select',
                querymain: 'dailyAlert',
                queryname: 'SelectCaseDCount'
            },
            {
                crudType: 'Select',
                querymain: 'dailyAlert',
                queryname: 'SelectILCount'
            }
        ]).then(function (res) {
            console.log(res["returnData"]);
            var _returnData = [];
            for(var i in res["returnData"]){
                _returnData.push(res["returnData"][i][0].COUNT);
            }
            $vm.allCountData = _returnData;
        }, function (err) {

        });
    }

    function LoadCaseA(){
        RestfulApi.SearchMSSQLData({
            querymain: 'dailyAlert',
            queryname: 'SelectCaseA'
        }).then(function (res){
            console.log(res["returnData"]);
            $vm.caseAData = res["returnData"];
        }); 
    }

    function LoadCaseB(){
        RestfulApi.SearchMSSQLData({
            querymain: 'dailyAlert',
            queryname: 'SelectCaseB'
        }).then(function (res){
            console.log(res["returnData"]);
            $vm.caseBData = res["returnData"];
        }); 
    }

    function LoadCaseC(){
        RestfulApi.SearchMSSQLData({
            querymain: 'dailyAlert',
            queryname: 'SelectCaseC'
        }).then(function (res){
            console.log(res["returnData"]);
            $vm.caseCData = res["returnData"];
        }); 
    }

    function LoadCaseD(){
        RestfulApi.SearchMSSQLData({
            querymain: 'dailyAlert',
            queryname: 'SelectCaseD'
        }).then(function (res){
            console.log(res["returnData"]);
            $vm.caseDData = res["returnData"];
        }); 
    }
})