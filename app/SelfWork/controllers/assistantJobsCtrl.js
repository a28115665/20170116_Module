"use strict";

angular.module('app.selfwork').controller('AssistantJobsCtrl', function ($scope, $stateParams, $state, AuthApi, Session, toaster, $uibModal, $templateCache, RestfulApi) {
    
    var $vm = this;

	angular.extend(this, {
        Init : function(){
            $scope.ShowTabs = true;
            
            $vm.LoadData();
        },
        profile : Session.Get(),
        defaultTab : 'hr2',
        TabSwitch : function(pTabID){
            return pTabID == $vm.defaultTab ? 'active' : '';
        },
        LoadData : function(){
            console.log($vm.defaultTab);
            switch($vm.defaultTab){
                case 'hr1':
                    // LoadPrincipal();
                    break;
                case 'hr2':
                    LoadPullGoods();
                    break;
            }
        },
        gridMethod : {
            //退件
            rejectData : function(row){
                console.log(row);
            },
            //編輯
            modifyData : function(row){
                console.log(row);
                $state.transitionTo("app.selfwork.jobs.editorjob", {
                    data: {
                      id: 5,
                      blue: '#0000FF'
                    }
                });
            },
            //結單
            closeData : function(row){
                console.log(row);
            }
        },
        pullGoodsOptions : {
            data:  '$vm.pullGoodsData',
            columnDefs: [
                { name: 'OL_IMPORTDT'   , displayName: '進口日期', cellFilter: 'dateFilter' },
                { name: 'OL_CO_CODE'    , displayName: '行家', cellFilter: 'compyFilter' },
                { name: 'OL_FLIGHTNO'   , displayName: '航班' },
                { name: 'OL_MASTER'     , displayName: '主號' },
                { name: 'OL_COUNTRY'    , displayName: '起運國別' },
                { name: 'PG_BAGNO'      , displayName: '袋號' },
                { name: 'PG_MOVED'      , displayName: '移機', cellFilter: 'booleanFilter' },
                { name: 'PG_FLIGHTNO'   , displayName: '航班(改)' },
                { name: 'PG_MASTER'     , displayName: '主號(改)' },
                { name: 'Options',  displayName: '操作', cellTemplate: $templateCache.get('accessibilityToDMC') }
            ],
            enableFiltering: false,
            enableSorting: false,
            enableColumnMenus: false,
            // enableVerticalScrollbar: false,
            paginationPageSizes: [10, 25, 50],
            paginationPageSize: 10,
            onRegisterApi: function(gridApi){
                $vm.pullGoodsGridApi = gridApi;
            }
        }
    });

    function LoadPullGoods(){
        RestfulApi.SearchMSSQLData({
            querymain: 'assistantJobs',
            queryname: 'SelectPullGoods'
        }).then(function (res){
            console.log(res["returnData"]);
            $vm.pullGoodsData = res["returnData"];
        }); 
    };

})