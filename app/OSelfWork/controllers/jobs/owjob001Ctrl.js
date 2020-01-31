"use strict";

angular.module('app.oselfwork').controller('OWJob001Ctrl', function ($scope, $stateParams, $state, AuthApi, Session, toaster, $uibModal, $templateCache, RestfulApi, ToolboxApi, uiGridConstants, $filter, $q, bool) {
    // console.log('Job001Ctrl:', $stateParams, $state);

    var $vm = this,
        cellClassEditabled = [];

    angular.extend(this, {
        Init : function(){
            // 不正常登入此頁面
            if($stateParams.data == null){
                ReturnToLastPage();
            }else{

                $vm.bigBreadcrumbsItems = $state.current.name.split(".");
                $vm.bigBreadcrumbsItems.shift();

                $vm.vmData = $stateParams.data;

                // 測試用
                // if($vm.vmData == null){
                //     $vm.vmData = {
                //         OL_SEQ : 'AdminTest20170525190758',
                //         OL_IMPORTDT : '2017-04-19T10:10:47.906Z'
                //     };
                // }
                
                // 找出所有檢核有問題的資料
                CaculateWrongJob();

                // 預設剛進來的選項
                $vm.currentButton = 'RepeatGet';
            }
        },
        loading : {
            update : false
        },
        repeatGet : [],
        peopleNotTheSameGetNo : [],
        getNoIsTrue : [],
        phoneWithSameNameButDifferentCode : [],
        currentButton : null,
        profile : Session.Get(),
        repeatGetOptions : {
            data: '$vm.repeatGet',
            columnDefs: [
                { name: 'O_IL_SENDENAME'        , displayName: '出口人英文名稱', width: 110, pinnedLeft:true, enableCellEdit: false },
                { name: 'O_IL_NEWSENDENAME'     , displayName: '新出口人英文名稱', width: 110, pinnedLeft:true, headerCellClass: 'text-primary' },
                { name: 'O_IL_GETNO'            , displayName: '進口人統一編號', width: 110, pinnedLeft:true, headerCellClass: 'text-primary' },
                { name: 'O_IL_G1'               , displayName: '報關種類', width: 80, enableCellEdit: false },
                { name: 'O_IL_SMALLNO'          , displayName: '小號', width: 110, enableCellEdit: false },
                { name: 'O_IL_POSTNO'           , displayName: '艙單號碼', width: 110, enableCellEdit: false },
                { name: 'O_IL_CUSTID'           , displayName: '快遞業者統一編號', width: 110, enableCellEdit: false },
                { name: 'O_IL_PRICECONDITON'    , displayName: '單價條件', width: 110, enableCellEdit: false },
                { name: 'O_IL_CURRENCY'         , displayName: '單價幣別代碼', width: 110, enableCellEdit: false },
                { name: 'O_IL_CROSSWEIGHT'      , displayName: '毛重', width: 110, enableCellEdit: false },
                { name: 'O_IL_NEWCROSSWEIGHT'   , displayName: '新毛重', width: 110, enableCellEdit: false },
                { name: 'O_IL_CTN'              , displayName: '件數', width: 110, enableCellEdit: false },
                { name: 'O_IL_NEWCTN'           , displayName: '新件數', width: 110, enableCellEdit: false },
                { name: 'O_IL_CTNUNIT'          , displayName: '件數單位', width: 110, enableCellEdit: false },
                { name: 'O_IL_MARK'             , displayName: '標記', width: 110, enableCellEdit: false },
                { name: 'O_IL_SMALLNO_ID'       , displayName: '貨物編號', width: 110, enableCellEdit: false },
                { name: 'O_IL_NATURE'           , displayName: '貨物名稱', width: 110, enableCellEdit: false, cellTooltip: cellTooltip},
                { name: 'O_IL_NATURE_NEW'       , displayName: '新貨物名稱', width: 110, enableCellEdit: false, cellTooltip: cellTooltip},
                { name: 'O_IL_TAX'              , displayName: '稅則', width: 110, enableCellEdit: false },
                { name: 'O_IL_TAX2'             , displayName: '新稅則', width: 110, enableCellEdit: false },
                { name: 'O_IL_BRAND'            , displayName: '商標', width: 110, enableCellEdit: false },
                { name: 'O_IL_FORMAT'           , displayName: '成分及規格', width: 110, enableCellEdit: false },
                { name: 'O_IL_NETWEIGHT'        , displayName: '淨重', width: 110, enableCellEdit: false },
                { name: 'O_IL_NETWEIGHT_NEW'    , displayName: '新淨重', width: 110, enableCellEdit: false },
                { name: 'O_IL_COUNT'            , displayName: '數量', width: 110, enableCellEdit: false },
                { name: 'O_IL_NEWCOUNT'         , displayName: '新數量', width: 110, enableCellEdit: false },
                { name: 'O_IL_PRICEUNIT'        , displayName: '單價', width: 110, enableCellEdit: false },
                { name: 'O_IL_NEWPRICEUNIT'     , displayName: '新單價', width: 110, enableCellEdit: false },
                { name: 'O_IL_PCS'              , displayName: '數量單位', width: 110, enableCellEdit: false},
                { name: 'O_IL_NEWPCS'           , displayName: '新數量單位', width: 110, enableCellEdit: false},
                { name: 'O_IL_INVOICECOST'      , displayName: '發票總金額', width: 110, enableCellEdit: false },
                { name: 'O_IL_INVOICECOST2'     , displayName: '新發票總金額', width: 110, enableCellEdit: false },
                { name: 'O_IL_FINALCOST'        , displayName: '完稅價格', width: 110, enableCellEdit: false},
                { name: 'O_IL_VOLUME'           , displayName: '體積', width: 110, enableCellEdit: false },
                { name: 'O_IL_VOLUMEUNIT'       , displayName: '體積單位', width: 110, enableCellEdit: false },
                { name: 'O_IL_COUNTRY'          , displayName: '生產國別', width: 110, enableCellEdit: false },
                { name: 'O_IL_COUNTRYID'        , displayName: '出口人國家代碼', width: 110, enableCellEdit: false },
                { name: 'O_IL_NEWCOUNTRYID'     , displayName: '新出口人國家代碼', width: 110, enableCellEdit: false },
                { name: 'O_IL_SENDADDRESS'      , displayName: '出口人英文地址', width: 110, enableCellEdit: false },
                { name: 'O_IL_NEWSENDADDRESS'   , displayName: '新出口人英文地址', width: 110, enableCellEdit: false },
                { name: 'O_IL_GETID'            , displayName: '進口人身分識別碼', width: 110, enableCellEdit: false },
                { name: 'O_IL_GETENAME'         , displayName: '進口人英文名稱', width: 110, enableCellEdit: false },
                { name: 'O_IL_GETPHONE'         , displayName: '進口人電話', width: 110, enableCellEdit: false },
                { name: 'O_IL_GETADDRESS'       , displayName: '進口人英文地址', width: 110, enableCellEdit: false },
                { name: 'O_IL_DWKIND'           , displayName: '貨櫃種類', width: 110, enableCellEdit: false },
                { name: 'O_IL_DWNUMBER'         , displayName: '貨櫃號碼', width: 110, enableCellEdit: false },
                { name: 'O_IL_DWTYPE'           , displayName: '貨櫃裝運方式', width: 110, enableCellEdit: false },
                // { name: 'O_IL_SEALNUMBER'       , displayName: '封條號碼', width: 110, enableCellEdit: false },
                // { name: 'O_IL_DECLAREMEMO1'     , displayName: '其他申報事項1', width: 110, enableCellEdit: false },
                { name: 'O_IL_DECLAREMEMO2'     , displayName: '其他申報事項2', width: 110, enableCellEdit: false },
                { name: 'O_IL_TAXPAYMENTMEMO'   , displayName: '主動申報繳納稅款註記', width: 110, enableCellEdit: false }
            ],
            rowTemplate: '<div> \
                            <div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{\'cell-class-pull\' : row.entity.O_PG_PULLGOODS == true, \'cell-class-special\' : row.entity.O_SPG_SPECIALGOODS != 0}" ui-grid-cell></div> \
                          </div>',
            enableFiltering: true,
            enableSorting: true,
            enableColumnMenus: false,
            // enableVerticalScrollbar: false,
		    enableRowSelection: true,
    		enableSelectAll: true,
            paginationPageSizes: [50, 100, 150, 200, 250, 300],
            paginationPageSize: 100,
            // rowEditWaitInterval: -1,
            onRegisterApi: function(gridApi){
                $vm.repeatGetGridApi = gridApi;

                gridApi.rowEdit.on.saveRow($scope, $vm.Update);

                gridApi.edit.on.beginCellEdit($scope, function (rowEntity, colDef, newValue, oldValue){
                    $vm.loading.update = true;
                });
            }
        },
        /**
         * [RepeatGet description] 檢查重複進口人
         */
        RepeatGet : function(){

            if($vm.loading.update){
                return;
            }

            $vm.currentButton = 'RepeatGet';

            // RestfulApi.SearchMSSQLData({
            //     querymain: 'ojob001',
            //     queryname: 'RepeatGet',
            //     params: {
            //         O_IL_SEQ: $vm.vmData.O_OL_SEQ
            //     }
            // }).then(function (res){
            //     console.log(res["returnData"]);

            //     var _data = res["returnData"] || [];

            //     $vm.repeatGetData = angular.copy(_data);

            // }); 
        },
        peopleNotTheSameGetNoOptions : {
            data: '$vm.peopleNotTheSameGetNo',
            columnDefs: [
                { name: 'O_IL_GETNO'            , displayName: '進口人統一編號', width: 110, pinnedLeft:true, headerCellClass: 'text-primary' },
                { name: 'O_IL_GETENAME'         , displayName: '進口人英文名稱', width: 110, pinnedLeft:true, headerCellClass: 'text-primary' },
                { name: 'O_IL_G1'               , displayName: '報關種類', width: 80, enableCellEdit: false },
                { name: 'O_IL_SMALLNO'          , displayName: '小號', width: 110, enableCellEdit: false },
                { name: 'O_IL_POSTNO'           , displayName: '艙單號碼', width: 110, enableCellEdit: false },
                { name: 'O_IL_CUSTID'           , displayName: '快遞業者統一編號', width: 110, enableCellEdit: false },
                { name: 'O_IL_PRICECONDITON'    , displayName: '單價條件', width: 110, enableCellEdit: false },
                { name: 'O_IL_CURRENCY'         , displayName: '單價幣別代碼', width: 110, enableCellEdit: false },
                { name: 'O_IL_CROSSWEIGHT'      , displayName: '毛重', width: 110, enableCellEdit: false },
                { name: 'O_IL_NEWCROSSWEIGHT'   , displayName: '新毛重', width: 110, enableCellEdit: false },
                { name: 'O_IL_CTN'              , displayName: '件數', width: 110, enableCellEdit: false },
                { name: 'O_IL_NEWCTN'           , displayName: '新件數', width: 110, enableCellEdit: false },
                { name: 'O_IL_CTNUNIT'          , displayName: '件數單位', width: 110, enableCellEdit: false },
                { name: 'O_IL_MARK'             , displayName: '標記', width: 110, enableCellEdit: false },
                { name: 'O_IL_SMALLNO_ID'       , displayName: '貨物編號', width: 110, enableCellEdit: false },
                { name: 'O_IL_NATURE'           , displayName: '貨物名稱', width: 110, enableCellEdit: false, cellTooltip: cellTooltip},
                { name: 'O_IL_NATURE_NEW'       , displayName: '新貨物名稱', width: 110, enableCellEdit: false, cellTooltip: cellTooltip},
                { name: 'O_IL_TAX'              , displayName: '稅則', width: 110, enableCellEdit: false },
                { name: 'O_IL_TAX2'             , displayName: '新稅則', width: 110, enableCellEdit: false },
                { name: 'O_IL_BRAND'            , displayName: '商標', width: 110, enableCellEdit: false },
                { name: 'O_IL_FORMAT'           , displayName: '成分及規格', width: 110, enableCellEdit: false },
                { name: 'O_IL_NETWEIGHT'        , displayName: '淨重', width: 110, enableCellEdit: false },
                { name: 'O_IL_NETWEIGHT_NEW'    , displayName: '新淨重', width: 110, enableCellEdit: false },
                { name: 'O_IL_COUNT'            , displayName: '數量', width: 110, enableCellEdit: false },
                { name: 'O_IL_NEWCOUNT'         , displayName: '新數量', width: 110, enableCellEdit: false },
                { name: 'O_IL_PRICEUNIT'        , displayName: '單價', width: 110, enableCellEdit: false },
                { name: 'O_IL_NEWPRICEUNIT'     , displayName: '新單價', width: 110, enableCellEdit: false },
                { name: 'O_IL_PCS'              , displayName: '數量單位', width: 110, enableCellEdit: false},
                { name: 'O_IL_NEWPCS'           , displayName: '新數量單位', width: 110, enableCellEdit: false},
                { name: 'O_IL_INVOICECOST'      , displayName: '發票總金額', width: 110, enableCellEdit: false },
                { name: 'O_IL_INVOICECOST2'     , displayName: '新發票總金額', width: 110, enableCellEdit: false },
                { name: 'O_IL_FINALCOST'        , displayName: '完稅價格', width: 110, enableCellEdit: false},
                { name: 'O_IL_VOLUME'           , displayName: '體積', width: 110, enableCellEdit: false },
                { name: 'O_IL_VOLUMEUNIT'       , displayName: '體積單位', width: 110, enableCellEdit: false },
                { name: 'O_IL_COUNTRY'          , displayName: '生產國別', width: 110, enableCellEdit: false },
                { name: 'O_IL_SENDENAME'        , displayName: '出口人英文名稱', width: 110, enableCellEdit: false },
                { name: 'O_IL_NEWSENDENAME'     , displayName: '新出口人英文名稱', width: 110, enableCellEdit: false },
                { name: 'O_IL_COUNTRYID'        , displayName: '出口人國家代碼', width: 110, enableCellEdit: false },
                { name: 'O_IL_NEWCOUNTRYID'     , displayName: '新出口人國家代碼', width: 110, enableCellEdit: false },
                { name: 'O_IL_SENDADDRESS'      , displayName: '出口人英文地址', width: 110, enableCellEdit: false },
                { name: 'O_IL_NEWSENDADDRESS'   , displayName: '新出口人英文地址', width: 110, enableCellEdit: false },
                { name: 'O_IL_GETID'            , displayName: '進口人身分識別碼', width: 110, enableCellEdit: false },
                { name: 'O_IL_GETPHONE'         , displayName: '進口人電話', width: 110, enableCellEdit: false },
                { name: 'O_IL_GETADDRESS'       , displayName: '進口人英文地址', width: 110, enableCellEdit: false },
                { name: 'O_IL_DWKIND'           , displayName: '貨櫃種類', width: 110, enableCellEdit: false },
                { name: 'O_IL_DWNUMBER'         , displayName: '貨櫃號碼', width: 110, enableCellEdit: false },
                { name: 'O_IL_DWTYPE'           , displayName: '貨櫃裝運方式', width: 110, enableCellEdit: false },
                // { name: 'O_IL_SEALNUMBER'       , displayName: '封條號碼', width: 110, enableCellEdit: false },
                // { name: 'O_IL_DECLAREMEMO1'     , displayName: '其他申報事項1', width: 110, enableCellEdit: false },
                { name: 'O_IL_DECLAREMEMO2'     , displayName: '其他申報事項2', width: 110, enableCellEdit: false },
                { name: 'O_IL_TAXPAYMENTMEMO'   , displayName: '主動申報繳納稅款註記', width: 110, enableCellEdit: false }
            ],
            rowTemplate: '<div> \
                            <div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{\'cell-class-pull\' : row.entity.O_PG_PULLGOODS == true, \'cell-class-special\' : row.entity.O_SPG_SPECIALGOODS != 0}" ui-grid-cell></div> \
                          </div>',
            enableFiltering: true,
            enableSorting: true,
            enableColumnMenus: false,
            // enableVerticalScrollbar: false,
            enableRowSelection: true,
            enableSelectAll: true,
            paginationPageSizes: [50, 100, 150, 200, 250, 300],
            paginationPageSize: 100,
            // rowEditWaitInterval: -1,
            onRegisterApi: function(gridApi){
                $vm.peopleNotTheSameGetNoGridApi = gridApi;

                gridApi.rowEdit.on.saveRow($scope, $vm.Update);

                gridApi.edit.on.beginCellEdit($scope, function (rowEntity, colDef, newValue, oldValue){
                    $vm.loading.update = true;
                });
            }
        },
        /**
         * [PeopleNotTheSameGetNo description] 檢查重複統編不同人
         */
        PeopleNotTheSameGetNo : function(){

            if($vm.loading.update){
                return;
            }

            $vm.currentButton = 'PeopleNotTheSameGetNo';

            // RestfulApi.SearchMSSQLData({
            //     querymain: 'ojob001',
            //     queryname: 'PeopleNotTheSameGetNo',
            //     params: {
            //         O_IL_SEQ: $vm.vmData.O_OL_SEQ
            //     }
            // }).then(function (res){
            //     console.log(res["returnData"]);

            //     var _data = res["returnData"] || [];

            //     $vm.peopleNotTheSameGetNoData = angular.copy(_data);
            // }); 
        },
        getNoIsTrueOptions : {
            data: '$vm.getNoIsTrue',
            columnDefs: [
                { name: 'O_IL_GETNO'            , displayName: '進口人統一編號', width: 110, pinnedLeft:true, headerCellClass: 'text-primary' },
                { name: 'O_IL_G1'               , displayName: '報關種類', width: 80, enableCellEdit: false },
                { name: 'O_IL_SMALLNO'          , displayName: '小號', width: 110, enableCellEdit: false },
                { name: 'O_IL_POSTNO'           , displayName: '艙單號碼', width: 110, enableCellEdit: false },
                { name: 'O_IL_CUSTID'           , displayName: '快遞業者統一編號', width: 110, enableCellEdit: false },
                { name: 'O_IL_PRICECONDITON'    , displayName: '單價條件', width: 110, enableCellEdit: false },
                { name: 'O_IL_CURRENCY'         , displayName: '單價幣別代碼', width: 110, enableCellEdit: false },
                { name: 'O_IL_CROSSWEIGHT'      , displayName: '毛重', width: 110, enableCellEdit: false },
                { name: 'O_IL_NEWCROSSWEIGHT'   , displayName: '新毛重', width: 110, enableCellEdit: false },
                { name: 'O_IL_CTN'              , displayName: '件數', width: 110, enableCellEdit: false },
                { name: 'O_IL_NEWCTN'           , displayName: '新件數', width: 110, enableCellEdit: false },
                { name: 'O_IL_CTNUNIT'          , displayName: '件數單位', width: 110, enableCellEdit: false },
                { name: 'O_IL_MARK'             , displayName: '標記', width: 110, enableCellEdit: false },
                { name: 'O_IL_SMALLNO_ID'       , displayName: '貨物編號', width: 110, enableCellEdit: false },
                { name: 'O_IL_NATURE'           , displayName: '貨物名稱', width: 110, enableCellEdit: false, cellTooltip: cellTooltip},
                { name: 'O_IL_NATURE_NEW'       , displayName: '新貨物名稱', width: 110, enableCellEdit: false, cellTooltip: cellTooltip},
                { name: 'O_IL_TAX'              , displayName: '稅則', width: 110, enableCellEdit: false },
                { name: 'O_IL_TAX2'             , displayName: '新稅則', width: 110, enableCellEdit: false },
                { name: 'O_IL_BRAND'            , displayName: '商標', width: 110, enableCellEdit: false },
                { name: 'O_IL_FORMAT'           , displayName: '成分及規格', width: 110, enableCellEdit: false },
                { name: 'O_IL_NETWEIGHT'        , displayName: '淨重', width: 110, enableCellEdit: false },
                { name: 'O_IL_NETWEIGHT_NEW'    , displayName: '新淨重', width: 110, enableCellEdit: false },
                { name: 'O_IL_COUNT'            , displayName: '數量', width: 110, enableCellEdit: false },
                { name: 'O_IL_NEWCOUNT'         , displayName: '新數量', width: 110, enableCellEdit: false },
                { name: 'O_IL_PRICEUNIT'        , displayName: '單價', width: 110, enableCellEdit: false },
                { name: 'O_IL_NEWPRICEUNIT'     , displayName: '新單價', width: 110, enableCellEdit: false },
                { name: 'O_IL_PCS'              , displayName: '數量單位', width: 110, enableCellEdit: false},
                { name: 'O_IL_NEWPCS'           , displayName: '新數量單位', width: 110, enableCellEdit: false},
                { name: 'O_IL_INVOICECOST'      , displayName: '發票總金額', width: 110, enableCellEdit: false },
                { name: 'O_IL_INVOICECOST2'     , displayName: '新發票總金額', width: 110, enableCellEdit: false },
                { name: 'O_IL_FINALCOST'        , displayName: '完稅價格', width: 110, enableCellEdit: false},
                { name: 'O_IL_VOLUME'           , displayName: '體積', width: 110, enableCellEdit: false },
                { name: 'O_IL_VOLUMEUNIT'       , displayName: '體積單位', width: 110, enableCellEdit: false },
                { name: 'O_IL_COUNTRY'          , displayName: '生產國別', width: 110, enableCellEdit: false },
                { name: 'O_IL_SENDENAME'        , displayName: '出口人英文名稱', width: 110, enableCellEdit: false },
                { name: 'O_IL_NEWSENDENAME'     , displayName: '新出口人英文名稱', width: 110, enableCellEdit: false },
                { name: 'O_IL_COUNTRYID'        , displayName: '出口人國家代碼', width: 110, enableCellEdit: false },
                { name: 'O_IL_NEWCOUNTRYID'     , displayName: '新出口人國家代碼', width: 110, enableCellEdit: false },
                { name: 'O_IL_SENDADDRESS'      , displayName: '出口人英文地址', width: 110, enableCellEdit: false },
                { name: 'O_IL_NEWSENDADDRESS'   , displayName: '新出口人英文地址', width: 110, enableCellEdit: false },
                { name: 'O_IL_GETID'            , displayName: '進口人身分識別碼', width: 110, enableCellEdit: false },
                { name: 'O_IL_GETENAME'         , displayName: '進口人英文名稱', width: 110, enableCellEdit: false },
                { name: 'O_IL_GETPHONE'         , displayName: '進口人電話', width: 110, enableCellEdit: false },
                { name: 'O_IL_GETADDRESS'       , displayName: '進口人英文地址', width: 110, enableCellEdit: false },
                { name: 'O_IL_DWKIND'           , displayName: '貨櫃種類', width: 110, enableCellEdit: false },
                { name: 'O_IL_DWNUMBER'         , displayName: '貨櫃號碼', width: 110, enableCellEdit: false },
                { name: 'O_IL_DWTYPE'           , displayName: '貨櫃裝運方式', width: 110, enableCellEdit: false },
                // { name: 'O_IL_SEALNUMBER'       , displayName: '封條號碼', width: 110, enableCellEdit: false },
                // { name: 'O_IL_DECLAREMEMO1'     , displayName: '其他申報事項1', width: 110, enableCellEdit: false },
                { name: 'O_IL_DECLAREMEMO2'     , displayName: '其他申報事項2', width: 110, enableCellEdit: false },
                { name: 'O_IL_TAXPAYMENTMEMO'   , displayName: '主動申報繳納稅款註記', width: 110, enableCellEdit: false }
            ],
            rowTemplate: '<div> \
                            <div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{\'cell-class-pull\' : row.entity.O_PG_PULLGOODS == true, \'cell-class-special\' : row.entity.O_SPG_SPECIALGOODS != 0}" ui-grid-cell></div> \
                          </div>',
            enableFiltering: true,
            enableSorting: true,
            enableColumnMenus: false,
            // enableVerticalScrollbar: false,
            enableRowSelection: true,
            enableSelectAll: true,
            paginationPageSizes: [50, 100, 150, 200, 250, 300],
            paginationPageSize: 100,
            // rowEditWaitInterval: -1,
            onRegisterApi: function(gridApi){
                $vm.getNoIsTrueGridApi = gridApi;

                gridApi.rowEdit.on.saveRow($scope, $vm.Update);

                gridApi.edit.on.beginCellEdit($scope, function (rowEntity, colDef, newValue, oldValue){
                    $vm.loading.update = true;
                });
            }
        },
        /**
         * [GetNoIsTrue description] 檢查統編正確性
         */
        GetNoIsTrue : function(){

            if($vm.loading.update){
                return;
            }

            $vm.currentButton = 'GetNoIsTrue';
        },
        phoneWithSameNameButDifferentCodeOptions : {
            data: '$vm.phoneWithSameNameButDifferentCode',
            columnDefs: [
                { name: 'O_IL_GETENAME'         , displayName: '進口人英文名稱', width: 110, pinnedLeft:true, headerCellClass: 'text-primary' },
                { name: 'O_IL_GETPHONE'         , displayName: '進口人電話', width: 110, pinnedLeft:true, headerCellClass: 'text-primary' },
                { name: 'O_IL_GETNO'            , displayName: '進口人統一編號', width: 110, pinnedLeft:true, headerCellClass: 'text-primary' },
                { name: 'O_IL_G1'               , displayName: '報關種類', width: 80, enableCellEdit: false },
                { name: 'O_IL_SMALLNO'          , displayName: '小號', width: 110, enableCellEdit: false },
                { name: 'O_IL_POSTNO'           , displayName: '艙單號碼', width: 110, enableCellEdit: false },
                { name: 'O_IL_CUSTID'           , displayName: '快遞業者統一編號', width: 110, enableCellEdit: false },
                { name: 'O_IL_PRICECONDITON'    , displayName: '單價條件', width: 110, enableCellEdit: false },
                { name: 'O_IL_CURRENCY'         , displayName: '單價幣別代碼', width: 110, enableCellEdit: false },
                { name: 'O_IL_CROSSWEIGHT'      , displayName: '毛重', width: 110, enableCellEdit: false },
                { name: 'O_IL_NEWCROSSWEIGHT'   , displayName: '新毛重', width: 110, enableCellEdit: false },
                { name: 'O_IL_CTN'              , displayName: '件數', width: 110, enableCellEdit: false },
                { name: 'O_IL_NEWCTN'           , displayName: '新件數', width: 110, enableCellEdit: false },
                { name: 'O_IL_CTNUNIT'          , displayName: '件數單位', width: 110, enableCellEdit: false },
                { name: 'O_IL_MARK'             , displayName: '標記', width: 110, enableCellEdit: false },
                { name: 'O_IL_SMALLNO_ID'       , displayName: '貨物編號', width: 110, enableCellEdit: false },
                { name: 'O_IL_NATURE'           , displayName: '貨物名稱', width: 110, enableCellEdit: false, cellTooltip: cellTooltip},
                { name: 'O_IL_NATURE_NEW'       , displayName: '新貨物名稱', width: 110, enableCellEdit: false, cellTooltip: cellTooltip},
                { name: 'O_IL_TAX'              , displayName: '稅則', width: 110, enableCellEdit: false },
                { name: 'O_IL_TAX2'             , displayName: '新稅則', width: 110, enableCellEdit: false },
                { name: 'O_IL_BRAND'            , displayName: '商標', width: 110, enableCellEdit: false },
                { name: 'O_IL_FORMAT'           , displayName: '成分及規格', width: 110, enableCellEdit: false },
                { name: 'O_IL_NETWEIGHT'        , displayName: '淨重', width: 110, enableCellEdit: false },
                { name: 'O_IL_NETWEIGHT_NEW'    , displayName: '新淨重', width: 110, enableCellEdit: false },
                { name: 'O_IL_COUNT'            , displayName: '數量', width: 110, enableCellEdit: false },
                { name: 'O_IL_NEWCOUNT'         , displayName: '新數量', width: 110, enableCellEdit: false },
                { name: 'O_IL_PRICEUNIT'        , displayName: '單價', width: 110, enableCellEdit: false },
                { name: 'O_IL_NEWPRICEUNIT'     , displayName: '新單價', width: 110, enableCellEdit: false },
                { name: 'O_IL_PCS'              , displayName: '數量單位', width: 110, enableCellEdit: false},
                { name: 'O_IL_NEWPCS'           , displayName: '新數量單位', width: 110, enableCellEdit: false},
                { name: 'O_IL_INVOICECOST'      , displayName: '發票總金額', width: 110, enableCellEdit: false },
                { name: 'O_IL_INVOICECOST2'     , displayName: '新發票總金額', width: 110, enableCellEdit: false },
                { name: 'O_IL_FINALCOST'        , displayName: '完稅價格', width: 110, enableCellEdit: false},
                { name: 'O_IL_VOLUME'           , displayName: '體積', width: 110, enableCellEdit: false },
                { name: 'O_IL_VOLUMEUNIT'       , displayName: '體積單位', width: 110, enableCellEdit: false },
                { name: 'O_IL_COUNTRY'          , displayName: '生產國別', width: 110, enableCellEdit: false },
                { name: 'O_IL_SENDENAME'        , displayName: '出口人英文名稱', width: 110, enableCellEdit: false },
                { name: 'O_IL_NEWSENDENAME'     , displayName: '新出口人英文名稱', width: 110, enableCellEdit: false },
                { name: 'O_IL_COUNTRYID'        , displayName: '出口人國家代碼', width: 110, enableCellEdit: false },
                { name: 'O_IL_NEWCOUNTRYID'     , displayName: '新出口人國家代碼', width: 110, enableCellEdit: false },
                { name: 'O_IL_SENDADDRESS'      , displayName: '出口人英文地址', width: 110, enableCellEdit: false },
                { name: 'O_IL_NEWSENDADDRESS'   , displayName: '新出口人英文地址', width: 110, enableCellEdit: false },
                { name: 'O_IL_GETID'            , displayName: '進口人身分識別碼', width: 110, enableCellEdit: false },
                { name: 'O_IL_GETADDRESS'       , displayName: '進口人英文地址', width: 110, enableCellEdit: false },
                { name: 'O_IL_DWKIND'           , displayName: '貨櫃種類', width: 110, enableCellEdit: false },
                { name: 'O_IL_DWNUMBER'         , displayName: '貨櫃號碼', width: 110, enableCellEdit: false },
                { name: 'O_IL_DWTYPE'           , displayName: '貨櫃裝運方式', width: 110, enableCellEdit: false },
                // { name: 'O_IL_SEALNUMBER'       , displayName: '封條號碼', width: 110, enableCellEdit: false },
                // { name: 'O_IL_DECLAREMEMO1'     , displayName: '其他申報事項1', width: 110, enableCellEdit: false },
                { name: 'O_IL_DECLAREMEMO2'     , displayName: '其他申報事項2', width: 110, enableCellEdit: false },
                { name: 'O_IL_TAXPAYMENTMEMO'   , displayName: '主動申報繳納稅款註記', width: 110, enableCellEdit: false }
            ],
            rowTemplate: '<div> \
                            <div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{\'cell-class-pull\' : row.entity.O_PG_PULLGOODS == true, \'cell-class-special\' : row.entity.O_SPG_SPECIALGOODS != 0}" ui-grid-cell></div> \
                          </div>',
            enableFiltering: true,
            enableSorting: true,
            enableColumnMenus: false,
            // enableVerticalScrollbar: false,
            enableRowSelection: true,
            enableSelectAll: true,
            paginationPageSizes: [50, 100, 150, 200, 250, 300],
            paginationPageSize: 100,
            // rowEditWaitInterval: -1,
            onRegisterApi: function(gridApi){
                $vm.phoneWithSameNameButDifferentCodeGridApi = gridApi;

                gridApi.rowEdit.on.saveRow($scope, $vm.Update);

                gridApi.edit.on.beginCellEdit($scope, function (rowEntity, colDef, newValue, oldValue){
                    $vm.loading.update = true;
                });
            }
        },
        /**
         * [PhoneWithSameNameButDifferentCode description] 檢查相同姓名電話但統編不同
         */
        PhoneWithSameNameButDifferentCode : function(){

            if($vm.loading.update){
                return;
            }

            $vm.currentButton = 'PhoneWithSameNameButDifferentCode';
        },
        UpdateWrongJob : function(){

            switch($vm.currentButton){
                case "RepeatGet":

                    RestfulApi.SearchMSSQLData({
                        querymain: 'ojob001',
                        queryname: 'RepeatGet',
                        params: {
                            O_IL_SEQ: $vm.vmData.O_OL_SEQ
                        }
                    }).then(function (res){
                        console.log(res["returnData"]);

                        var _data = res["returnData"] || [];
                        $vm.vmData.O_OL_FIX_LOGIC1 = _data.length;

                        RestfulApi.UpdateMSSQLData({
                            updatename: 'Update',
                            table: 40,
                            params: {
                                O_OL_FIX_LOGIC1  : _data.length
                            },
                            condition: {
                                O_OL_SEQ        : $vm.vmData.O_OL_SEQ
                            }
                        }).then(function (res) {
                            if(res["returnData"] > 0){
                                toaster.pop('success', '成功', '更新檢查重複進口人數量成功', 3000);
                            }else{
                                toaster.pop('danger', '失敗', '更新檢查重複進口人數量失敗', 3000);
                            }
                        });

                    }); 
                    break;
                case "PeopleNotTheSameGetNo":

                    RestfulApi.SearchMSSQLData({
                        querymain: 'ojob001',
                        queryname: 'PeopleNotTheSameGetNo',
                        params: {
                            O_IL_SEQ: $vm.vmData.O_OL_SEQ
                        }
                    }).then(function (res){
                        console.log(res["returnData"]);

                        var _data = res["returnData"] || [];
                        $vm.vmData.O_OL_FIX_LOGIC2 = _data.length;

                        RestfulApi.UpdateMSSQLData({
                            updatename: 'Update',
                            table: 40,
                            params: {
                                O_OL_FIX_LOGIC2  : _data.length
                            },
                            condition: {
                                O_OL_SEQ        : $vm.vmData.O_OL_SEQ
                            }
                        }).then(function (res) {
                            if(res["returnData"] > 0){
                                toaster.pop('success', '成功', '更新檢查重複統編不同人數量成功', 3000);
                            }else{
                                toaster.pop('danger', '失敗', '更新檢查重複統編不同人數量失敗', 3000);
                            }
                        });

                    }); 
                    break;
                case "GetNoIsTrue":

                    RestfulApi.SearchMSSQLData({
                        querymain: 'ojob001',
                        queryname: 'GetNoIsTrue',
                        params: {
                            O_IL_SEQ: $vm.vmData.O_OL_SEQ
                        }
                    }).then(function (res){
                        console.log(res["returnData"]);

                        var _data = res["returnData"] || [];
                        $vm.vmData.O_OL_FIX_LOGIC3 = _data.length;

                        RestfulApi.UpdateMSSQLData({
                            updatename: 'Update',
                            table: 40,
                            params: {
                                O_OL_FIX_LOGIC3  : _data.length
                            },
                            condition: {
                                O_OL_SEQ        : $vm.vmData.O_OL_SEQ
                            }
                        }).then(function (res) {
                            if(res["returnData"] > 0){
                                toaster.pop('success', '成功', '更新檢查統編正確性數量成功', 3000);
                            }else{
                                toaster.pop('danger', '失敗', '更新檢查統編正確性數量失敗', 3000);
                            }
                        });

                    }); 

                    break;
                case "PhoneWithSameNameButDifferentCode":

                    RestfulApi.SearchMSSQLData({
                        querymain: 'ojob001',
                        queryname: 'PhoneWithSameNameButDifferentCode',
                        params: {
                            O_IL_SEQ: $vm.vmData.O_OL_SEQ
                        }
                    }).then(function (res){
                        console.log(res["returnData"]);

                        var _data = res["returnData"] || [];
                        $vm.vmData.O_OL_FIX_LOGIC4 = _data.length;

                        RestfulApi.UpdateMSSQLData({
                            updatename: 'Update',
                            table: 40,
                            params: {
                                O_OL_FIX_LOGIC4  : _data.length
                            },
                            condition: {
                                O_OL_SEQ        : $vm.vmData.O_OL_SEQ
                            }
                        }).then(function (res) {
                            if(res["returnData"] > 0){
                                toaster.pop('success', '成功', '更新檢查相同姓名電話但統編不同數量成功', 3000);
                            }else{
                                toaster.pop('danger', '失敗', '更新檢查相同姓名電話但統編不同數量失敗', 3000);
                            }
                        });

                    }); 
                    break;
            }

            // 重新撈取資訊
            CaculateWrongJob();
        },
        IsComplete : function(){
            var _flag = true;

            if($vm.repeatGet.length == 0 &&
                $vm.peopleNotTheSameGetNo.length == 0 &&
                $vm.getNoIsTrue.length == 0 &&
                $vm.phoneWithSameNameButDifferentCode.length == 0 &&
                $vm.vmData != undefined &&
                $vm.vmData.O_OL_FIX_LOGIC1 == $vm.repeatGet.length &&
                $vm.vmData.O_OL_FIX_LOGIC2 == $vm.peopleNotTheSameGetNo.length &&
                $vm.vmData.O_OL_FIX_LOGIC3 == $vm.getNoIsTrue.length &&
                $vm.vmData.O_OL_FIX_LOGIC4 == $vm.phoneWithSameNameButDifferentCode.length){
                _flag = false;
            }

            return _flag;
        },
        Complete : function(){
            
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
                        return {};
                    },
                    show: function(){
                        return {
                            title : "是否完成"
                        }
                    }
                }
            });

            modalInstance.result.then(function(selectedItem) {

                RestfulApi.UpdateMSSQLData({
                    updatename: 'Update',
                    table: 40,
                    params: {
                        O_OL_ALREADY_FIXED : 1,
                        O_OL_FIXED_DATETIME  : $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                        O_OL_FIXED_USER : $vm.profile.U_ID
                    },
                    condition: {
                        O_OL_SEQ        : $vm.vmData.O_OL_SEQ
                    }
                }).then(function (res) {
                    ReturnToLastPage();
                });

            }, function() {
                // $log.info('Modal dismissed at: ' + new Date());
            });

        },
        Return : function(){
            ReturnToLastPage();
        },
        Update : function(entity){
            // console.log($vm.job001GridApi.rowEdit);
            // console.log($vm.job001GridApi.rowEdit.getDirtyRows($vm.job001GridApi.grid));
            // console.log(entity);

            // create a fake promise - normally you'd use the promise returned by $http or $resource
            var deferred = $q.defer();

            switch($vm.currentButton){
                case "RepeatGet":
                    $vm.repeatGetGridApi.rowEdit.setSavePromise( entity, deferred.promise );
                    break;
                case "PeopleNotTheSameGetNo":
                    $vm.peopleNotTheSameGetNoGridApi.rowEdit.setSavePromise( entity, deferred.promise );
                    break;
                case "GetNoIsTrue":
                    $vm.getNoIsTrueGridApi.rowEdit.setSavePromise( entity, deferred.promise );
                    break;
                case "PhoneWithSameNameButDifferentCode":
                    $vm.phoneWithSameNameButDifferentCodeGridApi.rowEdit.setSavePromise( entity, deferred.promise );
                    break;
            }
         
            RestfulApi.UpdateMSSQLData({
                updatename: 'Update',
                table: 41,
                params: {
                    O_IL_REMARK         : entity.O_IL_REMARK,
                    O_IL_G1             : entity.O_IL_G1,
                    O_IL_MERGENO        : entity.O_IL_MERGENO,
                    O_IL_NEWCROSSWEIGHT : isNaN(parseFloat(entity.O_IL_NEWCROSSWEIGHT)) ? null : entity.O_IL_NEWCROSSWEIGHT,
                    O_IL_NEWCTN         : isNaN(parseInt(entity.O_IL_NEWCTN)) ? null : entity.O_IL_NEWCTN,
                    O_IL_NATURE_NEW     : entity.O_IL_NATURE_NEW,
                    O_IL_TAX2           : entity.O_IL_TAX2,
                    // O_IL_TAXRATE2       : entity.O_IL_TAXRATE2,
                    O_IL_NETWEIGHT_NEW  : isNaN(parseFloat(entity.O_IL_NETWEIGHT_NEW)) ? null : entity.O_IL_NETWEIGHT_NEW,
                    O_IL_NEWCOUNT       : isNaN(parseInt(entity.O_IL_NEWCOUNT)) ? null : entity.O_IL_NEWCOUNT,
                    O_IL_NEWPRICEUNIT   : isNaN(parseFloat(entity.O_IL_NEWPRICEUNIT)) ? null : entity.O_IL_NEWPRICEUNIT,
                    O_IL_NEWPCS         : isNaN(parseInt(entity.IL_NEWPCS)) ? null : entity.IL_NEWPCS,
                    O_IL_INVOICECOST2   : isNaN(parseFloat(entity.O_IL_INVOICECOST2)) ? null : entity.O_IL_INVOICECOST2,
                    O_IL_FINALCOST      : isNaN(parseFloat(entity.IL_FINALCOST)) ? null : entity.IL_FINALCOST,
                    O_IL_NEWSENDENAME   : entity.O_IL_NEWSENDENAME,
                    O_IL_NEWCOUNTRYID   : entity.O_IL_NEWCOUNTRYID,
                    O_IL_NEWSENDADDRESS : entity.O_IL_NEWSENDADDRESS,
                    O_IL_GETNO           : entity.O_IL_GETNO,
                    O_IL_GETENAME        : entity.O_IL_GETENAME,
                    O_IL_GETPHONE        : entity.O_IL_GETPHONE,
                    O_IL_GETADDRESS      : entity.O_IL_GETADDRESS,
                    O_IL_DECLAREMEMO2    : entity.O_IL_DECLAREMEMO2,
                    O_IL_TAXPAYMENTMEMO  : entity.O_IL_TAXPAYMENTMEMO,
                    O_IL_UP_DATETIME     : $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                    O_IL_UP_USER         : $vm.profile.U_ID
                },
                condition: {
                    O_IL_SEQ        : entity.O_IL_SEQ,
                    O_IL_NEWSMALLNO : entity.O_IL_NEWSMALLNO,
                    O_IL_SMALLNO    : entity.O_IL_SMALLNO
                }
            }).then(function (res) {
                // console.log(res);
                deferred.resolve();
            }, function (err) {
                toaster.pop('error', '錯誤', '更新失敗', 3000);
                deferred.reject();
            }).finally(function(){
                $vm.loading.update = false;
            });
            
        }
    });

    function CaculateWrongJob(){

        // if($vm.loading.update){
        //     return;
        // }
        $vm.loading.update = true;

        var _tasks = [];

        _tasks.push({
            crudType: 'Select',
            querymain: 'ojob001',
            queryname: 'RepeatGet',
            params: {
                O_IL_SEQ: $vm.vmData.O_OL_SEQ
            }
        });

        _tasks.push({
            crudType: 'Select',
            querymain: 'ojob001',
            queryname: 'PeopleNotTheSameGetNo',
            params: {
                O_IL_SEQ: $vm.vmData.O_OL_SEQ
            }
        });

        _tasks.push({
            crudType: 'Select',
            querymain: 'ojob001',
            queryname: 'GetNoIsValid',
            params: {
                O_IL_SEQ: $vm.vmData.O_OL_SEQ
            }
        });

        _tasks.push({
            crudType: 'Select',
            querymain: 'ojob001',
            queryname: 'PhoneWithSameNameButDifferentCode',
            params: {
                O_IL_SEQ: $vm.vmData.O_OL_SEQ
            }
        });

        RestfulApi.CRUDMSSQLDataByTask(_tasks).then(function (res){
            if(res["returnData"].length > 0){
                console.log(res["returnData"]);
                $vm.repeatGet = res["returnData"][0];
                $vm.peopleNotTheSameGetNo = res["returnData"][1];
                $vm.getNoIsTrue = res["returnData"][2];
                $vm.phoneWithSameNameButDifferentCode = res["returnData"][3];

                // 如果原始數量和未更新數量相同，表示尚未需要更新資料
                if($vm.vmData.O_OL_FIX_LOGIC1 == $vm.repeatGet.length &&
                    $vm.vmData.O_OL_FIX_LOGIC2 == $vm.peopleNotTheSameGetNo.length &&
                    $vm.vmData.O_OL_FIX_LOGIC3 == $vm.getNoIsTrue.length &&
                    $vm.vmData.O_OL_FIX_LOGIC4 == $vm.phoneWithSameNameButDifferentCode.length){
                    $vm.loading.wrongJobNeedToUpdate = false;
                }
            }
        }).finally(function() {
            $vm.loading.update = false;
        });  

    };

    function CalculationFinalCost(rowEntity, colDef, newValue, oldValue){

        // 編輯為 進口人統編
        if(colDef.name == 'O_IL_GETNO'){
            // 當有輸入值時
            if(newValue != ''){
                var _getnoOverSix = $filter('filter')($vm.job001Data, { O_IL_GETNO: newValue, O_PG_PULLGOODS: 0, O_IL_G1: '' }, true);
                
                // 進口人統編 在該單 >=6次
                if(_getnoOverSix.length >= 6){
                    for(var i in _getnoOverSix){
                        _getnoOverSix[i]['O_IL_G1'] = 'Y';
                    }
                    $vm.job001GridApi.rowEdit.setRowsDirty(_getnoOverSix);
                    return;
                }

                // 清除如果先編輯後才拉貨的統編
                var _getnoOverSix = $filter('filter')($vm.job001Data, { O_IL_GETNO: newValue, O_IL_G1: 'Y' }, true);
                for(var i in _getnoOverSix){
                    _getnoOverSix[i]['O_IL_G1'] = '';
                }

                $vm.job001GridApi.rowEdit.setRowsDirty(_getnoOverSix);
                return;
            }else{
                // 當沒輸入值時 清空原本的Y
                var _getnoOverSix = $filter('filter')($vm.job001Data, { O_IL_GETNO: oldValue, O_PG_PULLGOODS: 0, O_IL_G1: 'Y' }, true);

                _getnoOverSix.push(rowEntity);
                for(var i in _getnoOverSix){
                    _getnoOverSix[i]['O_IL_G1'] = '';
                }
            }
        }

        // 一律為大寫
        if(colDef.name == 'O_IL_G1' || colDef.name == 'O_IL_GETNO') {
            try {
                rowEntity["O_IL_G1"] = newValue.toUpperCase();
                rowEntity["O_IL_GETNO"] = newValue.toUpperCase();
            }
            catch (e) {
                console.log(e);
            }
        }

        // try {
            // if(newValue.toUpperCase() == "Y"){
            //     rowEntity.IL_WEIGHT_NEW = rowEntity.IL_WEIGHT;
            //     rowEntity.IL_NEWPCS = rowEntity.IL_PCS;
            //     rowEntity.IL_UNIVALENT_NEW = rowEntity.IL_UNIVALENT;
            //     rowEntity.IL_NEWSENDNAME = rowEntity.IL_SENDNAME;
            //     rowEntity.IL_FINALCOST = null;
            // }
        // }
        // catch (e) {
        //     console.log(e);
        // }

        // if(colDef.name == 'IL_GETNAME_NEW'){
        //     var _temp = encodeURI(rowEntity.IL_GETNAME_NEW),
        //         regex = /%09/gi;

        //     _temp = _temp.replace(regex, "%20");
        //     rowEntity.IL_GETNAME_NEW = decodeURI(_temp);
        // }

        // // 新單價 = 新重量 * 100 / 新數量
        // if(colDef.name == 'IL_WEIGHT_NEW' || colDef.name == 'IL_NEWPCS'){
        //     var _weight = parseFloat(rowEntity.IL_WEIGHT_NEW).toFixed(2),
        //         _pcs = parseInt(rowEntity.IL_NEWPCS);

        //     // 如果都不是空值 才開始計算
        //     if(!isNaN(_weight) && !isNaN(_pcs)){
        //         // 如果數量不為0
        //         if(parseInt(_pcs) != 0){
        //             rowEntity.IL_UNIVALENT_NEW = (_weight * 100) / _pcs;
        //         }else{
        //             rowEntity.IL_UNIVALENT_NEW = 0;
        //         }
        //     }
        // }

        // 計算發票總金額
        var _count = parseInt(rowEntity.O_IL_NEWCOUNT),
            _priceUnit = parseInt(rowEntity.O_IL_NEWPRICEUNIT),
            _invoiceCost = parseInt(rowEntity.O_IL_INVOICECOST2),
            start = 0;

        if(!isNaN(_count)){
            start += 1;
        }
        if(!isNaN(_priceUnit)){
            start += 1;
        }
        if(!isNaN(_invoiceCost)){
            start += 1;
        }

        // 表示可以開始計算
        if(start >= 2){
            // 新單價
            if(colDef.name == 'O_IL_NEWPRICEUNIT'){
                //如果數量有值
                if(!isNaN(_count)){
                    _invoiceCost = _count * _priceUnit;
                }
            }

            // 新數量
            if(colDef.name == 'O_IL_NEWCOUNT'){
                if(!isNaN(_priceUnit)){
                    _invoiceCost = _count * _priceUnit;
                }
            }

            // // 當完稅價格小於100
            // if(_finalcost < 100 && _finalcost != 0){
            //     // 給個新值 100~125
            //     var maxNum = 125;  
            //     var minNum = 100;  
            //     _finalcost = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum; 
            // }

            // // 當完稅價格超過2000 提醒使用者
            // if(_finalcost > 2000){
            //     toaster.pop('warning', '警告', '完稅價格超過2000元，請注意', 3000);
            // }
            
            // 當數量不為空 帶出單價 (會與新單價衝突)
            if(colDef.name == 'O_IL_NEWCOUNT' || colDef.name == 'O_IL_NEWPRICEUNIT' || colDef.name == 'O_IL_INVOICECOST2'){
                if(!isNaN(_count)){
                    if(parseInt(_count) != 0){
                        _priceUnit = Math.round(_invoiceCost / _count);
                    }else{
                        _priceUnit = 0;
                    }
                }
            }

            // 發票總金額
            if(colDef.name == 'O_IL_INVOICECOST2'){
                // 避免帳不平 再次計算完稅價格
                if(!isNaN(_count) && !isNaN(_priceUnit)){
                    _invoiceCost = _count * _priceUnit;
                }
            }

            // console.log("_invoiceCost:", _invoiceCost," _count:" , _count," _priceUnit:" , _priceUnit);
            rowEntity.O_IL_INVOICECOST2 = isNaN(_invoiceCost) ? null : _invoiceCost;
            rowEntity.O_IL_NEWCOUNT = isNaN(_count) ? null : _count;
            rowEntity.O_IL_NEWPRICEUNIT = isNaN(_priceUnit) ? null : _priceUnit;
        }

        $vm.job001GridApi.rowEdit.setRowsDirty([rowEntity]);

        // // console.log('edited row id:' + rowEntity.Index + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue);
    }

    function ReturnToLastPage(){
        $state.transitionTo($state.current.parent);
    };

});