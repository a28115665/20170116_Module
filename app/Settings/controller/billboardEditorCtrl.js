"use strict";

angular.module('app.settings').controller('BillboardEditorCtrl', function ($scope, $stateParams, $state, AuthApi, Session, toaster, $uibModal, $templateCache, RestfulApi, boolFilter, ioTypeFilter, uiGridConstants) {

    var $vm = this;

    angular.extend(this, {
        Init : function(){
            LoadBillboardEditor();
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
                    LoadBillboardEditor();
                    break;
                case 'hr2':
                    LoadBillboardHistory();
                    break;
            }
        },
        gridMethod : {
            //編輯
            modifyData : function(row){
                // console.log(row);
                $state.transitionTo("app.settings.billboardeditor.news", {
                    data: row.entity
                });
            }
        },
        billboardEditorOptions : {
            data: '$vm.billboardEditorData',
            columnDefs: [
                { name: 'BB_STICK_TOP'   , displayName: '置頂', cellFilter: 'booleanFilter', filter: 
                    {
                        term: null,
                        type: uiGridConstants.filter.SELECT,
                        selectOptions: boolFilter
                    }
                },
                { name: 'BB_POST_FROM'   , displayName: '開始日期', cellFilter: 'dateFilter' },
                { name: 'BB_POST_TOXX'   , displayName: '結束日期', cellFilter: 'dateFilter' },
                { name: 'BB_TITLE'       , displayName: '標題' },
                { name: 'BB_CONTENT'     , visible: false },
                { name: 'BB_IO_TYPE'     , displayName: '公佈類型', cellFilter: 'ioTypeFilter', filter: 
                    {
                        term: null,
                        type: uiGridConstants.filter.SELECT,
                        selectOptions: ioTypeFilter
                    }
                },
                { name: 'BB_CR_USER'     , visible: false},
                { name: 'BB_CR_DATETIME' , displayName: '建立時間', cellFilter: 'datetimeFilter' },
                { name: 'Options'        , displayName: '操作', width: '7%', enableFiltering: false, cellTemplate: $templateCache.get('accessibilityToM') }
            ],
            enableFiltering: true,
            enableSorting: false,
            enableColumnMenus: false,
            enableRowSelection: true,
            enableSelectAll: true,
            paginationPageSizes: [10, 25, 50],
            paginationPageSize: 10,
            onRegisterApi: function(gridApi){
                $vm.billboardEditorGridApi = gridApi;
            }
        },
        AddNews : function(){
            ChangeToAddNewsPage();
        },
        DeleteNews : function(){
            console.log($vm.billboardEditorGridApi.selection.getSelectedRows());
        },
        billboardHistoryOptions : {
            data: '$vm.billboardHistoryData',
            columnDefs: [
                { name: 'BB_STICK_TOP'   , displayName: '置頂', cellFilter: 'booleanFilter', filter: 
                    {
                        term: null,
                        type: uiGridConstants.filter.SELECT,
                        selectOptions: boolFilter
                    }
                },
                { name: 'BB_POST_FROM'   , displayName: '開始日期', cellFilter: 'dateFilter' },
                { name: 'BB_POST_TOXX'   , displayName: '結束日期', cellFilter: 'dateFilter' },
                { name: 'BB_TITLE'       , displayName: '標題' },
                { name: 'BB_IO_TYPE'     , displayName: '公佈類型', cellFilter: 'ioTypeFilter', filter: 
                    {
                        term: null,
                        type: uiGridConstants.filter.SELECT,
                        selectOptions: ioTypeFilter
                    }
                },
                { name: 'BB_CR_USER'     , visible: false},
                { name: 'BB_CR_DATETIME' , displayName: '建立時間', cellFilter: 'datetimeFilter' },
                { name: 'Options'        , displayName: '操作', width: '7%', enableFiltering: false, cellTemplate: $templateCache.get('accessibilityToM') }
            ],
            enableFiltering: true,
            enableSorting: false,
            enableColumnMenus: false,
            enableRowSelection: true,
            enableSelectAll: true,
            paginationPageSizes: [10, 25, 50],
            paginationPageSize: 10,
            onRegisterApi: function(gridApi){
                $vm.billboardHistoryGridApi = gridApi;
            }
        }
    });

    function LoadBillboardEditor(){
        RestfulApi.SearchMSSQLData({
            querymain: 'billboardEditor',
            queryname: 'SelectBBWithOK'
        }).then(function (res){
            console.log(res["returnData"]);
            $vm.billboardEditorData = res["returnData"];
        }).finally(function() {
            HandleWindowResize($vm.billboardEditorGridApi);
        });    
    };

    function LoadBillboardHistory(){
        RestfulApi.SearchMSSQLData({
            querymain: 'billboardEditor',
            queryname: 'SelectBBWithHistory'
        }).then(function (res){
            console.log(res["returnData"]);
            $vm.billboardHistoryData = res["returnData"];
        }).finally(function() {
            HandleWindowResize($vm.billboardHistoryGridApi);
        });    
    };

    function ChangeToAddNewsPage(){
        $state.transitionTo("app.settings.billboardeditor.news");
    };
})