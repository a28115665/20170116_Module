"use strict";

angular.module('app.concerns').controller('BanHistorySearchCtrl', function ($scope, $stateParams, $state, AuthApi, Session, toaster, $uibModal, $templateCache, RestfulApi, $filter, compy, bool, uiGridConstants, localStorageService) {
    
    var $vm = this;

	angular.extend(this, {
        profile : Session.Get(),
        boolData : bool,
        compyData : compy,
        resultOptions : {
            data:  '$vm.resultData',
            columnDefs: [
                { name: 'OL_IMPORTDT' ,  displayName: '進口日期', cellFilter: 'dateFilter' },
                { name: 'OL_CO_CODE'  ,  displayName: '行家', cellFilter: 'compyFilter', filter: 
                    {
                        term: null,
                        type: uiGridConstants.filter.SELECT,
                        selectOptions: compy
                    }
                },
                { name: 'OL_FLIGHTNO' ,  displayName: '航班' },
                { name: 'OL_MASTER'   ,  displayName: '主號' },
                { name: 'OL_COUNT'    ,  displayName: '報機單(袋數)', enableCellEdit: false },
                { name: 'OL_COUNTRY'  ,  displayName: '起運國別' },
                { name: 'ITEM_LIST'          ,  displayName: '報機單', enableFiltering: false, width: '8%', cellTemplate: $templateCache.get('accessibilityToOperaForJob001') },
                { name: 'FLIGHT_ITEM_LIST'   ,  displayName: '銷艙單', enableFiltering: false, width: '8%', cellTemplate: $templateCache.get('accessibilityToOperaForJob002') },
                { name: 'Options'       , displayName: '下載', width: '5%', enableCellEdit: false, enableFiltering: false, cellTemplate: $templateCache.get('accessibilityToOnceDownload') }
            ],
            enableFiltering: true,
            enableSorting: false,
            enableColumnMenus: false,
            // enableVerticalScrollbar: false,
            paginationPageSizes: [10, 25, 50],
            paginationPageSize: 10,
            onRegisterApi: function(gridApi){
                $vm.resultGridApi = gridApi;
            }
        },
        Cancel : function(){
            ClearSearchCondition();
        },
        Search : function(){
            // console.log($vm.vmData);
            $vm.resultData = [];

            if(IsConditionsHaveValue($vm.vmData)){
                SearchData();
            }else{
                toaster.pop('info', '訊息', '請輸入查詢條件', 3000);
            }
        }
    });

    function SearchData () {
        var _params = {};

        _params = CombineConditions($vm.vmData);
        
        console.log(_params);

        // RestfulApi.SearchMSSQLData({
        //     querymain: 'banHistorySearch',
        //     queryname: 'SelectSearch',
        //     params: _params
        // }).then(function (res){
        //     console.log(res["returnData"]);
        //     if(res["returnData"].length > 0){
        //         $vm.resultData = res["returnData"];
        //     }else{
        //         toaster.pop('info', '訊息', '查無資料', 3000);
        //     }
        // });
    }

    /**
     * IsConditionsHaveValue 檢查查詢條件是否為空
     * @param {[type]} true 表示有值, false 表示空值
     */
    function IsConditionsHaveValue(pObject){
        var _result = true,
            _isClear = true;

        if(pObject == {}){
            _result = false;
        }else{
            // 檢查所有值是否都是空的
            for(var i in pObject){
                if(pObject[i] != ""){
                    _isClear = false;
                    break;
                }
            }

            // 如果都是空的 回傳false
            if(_isClear){
                _result = false;
            }
        }

        return _result;
    }

    /**
     * CombineConditions 條件組合
     * @param {[type]}
     */
    function CombineConditions(pObject){
        var _conditions = {};

        for(var i in pObject){
            if(pObject[i] != ""){
                if(i == "START_DATETIME"){
                    _conditions[i] = pObject[i] + " 00:00:00";
                }else if(i == "END_DATETIME"){
                    _conditions[i] = pObject[i] + " 23:59:59";
                }else{
                    _conditions[i] = pObject[i];
                }
            }
        }

        return _conditions;
    }

    /**
     * [ClearSearchCondition description] 清除查詢條件
     */
    function ClearSearchCondition(){
        $vm.vmData = {};
    }

})