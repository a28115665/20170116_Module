"use strict";

angular.module('app.selfwork').controller('AssistantJobsCtrl', function ($scope, $stateParams, $state, AuthApi, Session, toaster, $uibModal, $templateCache, RestfulApi, $filter, uiGridConstants, compy, $window) {
    
    var $vm = this;

	angular.extend(this, {
        Init : function(){
            $scope.ShowTabs = true;
            
            $vm.LoadData();
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
                    LoadFlightArrival();
                    break;
                case 'hr2':
                    LoadFlightItem();
                    break;
                case 'hr3':
                    // LoadPullGoods();
                    break;
                case 'hr4':
                    // LoadPullGoods();
                    break;
                case 'hr5':
                    LoadPullGoods();
                    break;
            }
        },
        flightArrivalOptions : {
            data:  '$vm.flightArrivalData',
            columnDefs: [
                { name: 'FA_FLIGHTDATE'          ,  displayName: '起飛日期', cellFilter: 'dateFilter', width: 80 },
                { name: 'FA_AIR_LINEID'          ,  displayName: '航空代號', width: 80 },
                { name: 'FA_FLIGHTNUM'           ,  displayName: '貨機號碼', width: 80 },
                { name: 'FA_DEPART_AIRTID'       ,  displayName: '起飛來源', width: 80 },
                { name: 'FA_ARRIVAL_AIRPTID'     ,  displayName: '抵達目的', width: 80 },
                { name: 'FA_SCHEDL_ARRIVALTIME'  ,  displayName: '預計抵達時間', cellFilter: 'datetimeFilter' },
                { name: 'FA_ACTL_ARRIVALTIME'    ,  displayName: '真實抵達時間', cellFilter: 'datetimeFilter' },
                { name: 'FA_ARRIVAL_REMK'        ,  displayName: '狀態', width: 80, cellTemplate: $templateCache.get('accessibilityToArrivalRemark') },
                { name: 'FA_ARRIVAL_GATE'        ,  displayName: '登機口', width: 80 },
                { name: 'FA_UP_DATETIME'         ,  displayName: '資料更新時間', cellFilter: 'datetimeFilter' }
            ],
            enableFiltering: false,
            enableSorting: false,
            enableColumnMenus: false,
            // enableVerticalScrollbar: false,
            // paginationPageSizes: [10, 25, 50],
            // paginationPageSize: 10,
            onRegisterApi: function(gridApi){
                $vm.flightArrivalGridApi = gridApi;
            }
        },
        ReloadFlightArrival : function(){
            LoadFlightArrival();
            toaster.pop('success', '訊息', '重新整理完成', 3000);
        },
        gridMethod : {
            // 各單的工作選項
            gridOperation : function(row, name){
                // 給modal知道目前是哪個欄位操作
                row.entity['name'] = name;

                var modalInstance = $uibModal.open({
                    animation: true,
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    templateUrl: 'opWorkMenu.html',
                    controller: 'OpWorkMenuModalInstanceCtrl',
                    controllerAs: '$ctrl',
                    scope: $scope,
                    size: 'sm',
                    // windowClass: 'center-modal',
                    // appendTo: parentElem,
                    resolve: {
                        items: function() {
                            return row;
                        }
                    }
                });

                modalInstance.result.then(function(selectedItem) {
                    // $ctrl.selected = selectedItem;
                    console.log(selectedItem);

                }, function() {
                    // $log.info('Modal dismissed at: ' + new Date());
                });
            },
            // 各單的修改
            modifyData : function(row){
                console.log(row);
                var modalInstance = $uibModal.open({
                    animation: true,
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    template: $templateCache.get('modifyOrderList'),
                    controller: 'ModifyOrderListModalInstanceCtrl',
                    controllerAs: '$ctrl',
                    // size: 'sm',
                    // windowClass: 'center-modal',
                    // appendTo: parentElem,
                    resolve: {
                        vmData: function() {
                            return row.entity;
                        },
                        compy: function() {
                            return compy;
                        }
                    }
                });

                modalInstance.result.then(function(selectedItem) {
                    // $ctrl.selected = selectedItem;
                    console.log(selectedItem);

                    RestfulApi.UpdateMSSQLData({
                        updatename: 'Update',
                        table: 18,
                        params: {
                            OL_IMPORTDT : selectedItem.OL_IMPORTDT,
                            OL_CO_CODE  : selectedItem.OL_CO_CODE,
                            OL_FLIGHTNO : selectedItem.OL_FLIGHTNO,
                            OL_MASTER   : selectedItem.OL_MASTER,
                            OL_COUNTRY  : selectedItem.OL_COUNTRY
                        },
                        condition: {
                            OL_SEQ : selectedItem.OL_SEQ
                        }
                    }).then(function (res) {
                        LoadFlightItem();
                    });

                }, function() {
                    // $log.info('Modal dismissed at: ' + new Date());
                });
            },
            // 寄信
            sendMail : function(row){
                console.log(row);
            },
            // 貨物查看
            viewOrder : function(row){
                console.log(row);

                if(!angular.isUndefined(row.entity.OL_FLIGHTNO) && !angular.isUndefined(row.entity.OL_MASTER)){
                    
                    var _flightNo = row.entity.OL_FLIGHTNO.toUpperCase().split(" "),
                        _master = row.entity.OL_MASTER.split("-");

                    switch(_flightNo[0]){
                        case "BR":
                            $window.open('http://www.brcargo.com/ec_web/Default.aspx?TNT_FLAG=Y&AWB_CODE='+_master[0]+'&MAWB_NUMBER='+_master[1]);
                            break;
                        case "CI":
                            $window.open('https://cargo.china-airlines.com/ccnetv2/content/home/index.aspx');
                            break;
                        case "CX":
                            $window.open('http://www.cathaypacificcargo.com/ManageYourShipment/TrackYourShipment/tabid/108/SingleAWBNo/'+row.entity.OL_MASTER+'/language/en-US/Default.aspx');
                            break;
                        default:
                            toaster.pop('info', '訊息', '此航班代號不在設定內', 3000);
                            break;
                    }
                }
            }
        },
        gridMethodForJob002 : {
            // 檢視
            viewData : function(row){
                $state.transitionTo("app.selfwork.assistantjobs.job002", {
                    data: row.entity
                });
            },
            // 完成
            closeData : function(row){
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
                            return row.entity;
                        },
                        show: function(){
                            return {
                                title : "是否完成"
                            }
                        }
                    }
                });

                modalInstance.result.then(function(selectedItem) {
                    // $ctrl.selected = selectedItem;
                    console.log(selectedItem);

                    RestfulApi.InsertMSSQLData({
                        insertname: 'Insert',
                        table: 22,
                        params: {
                            OE_SEQ : selectedItem.OL_SEQ,
                            OE_TYPE : 'W', // 銷艙單
                            OE_PRINCIPAL : $vm.profile.U_ID,
                            OE_FDATETIME : $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')
                        }
                    }).then(function (res) {
                        toaster.pop('success', '訊息', '銷艙單已完成', 3000);
                        LoadFlightItem();
                    });

                }, function() {
                    // $log.info('Modal dismissed at: ' + new Date());
                });
            }
        },
        flightItemOptions : {
            data:  '$vm.flightItemData',
            columnDefs: [
                { name: 'OL_IMPORTDT'            ,  displayName: '進口日期', width: 80, cellFilter: 'dateFilter' },
                { name: 'OL_CO_CODE'             ,  displayName: '行家', width: 80, cellFilter: 'compyFilter', filter: 
                    {
                        term: null,
                        type: uiGridConstants.filter.SELECT,
                        selectOptions: compy
                    }
                },
                { name: 'OL_FLIGHTNO'            ,  displayName: '航班', width: 80 },
                { name: 'FA_SCHEDL_ARRIVALTIME'  ,  displayName: '預計抵達時間', cellFilter: 'datetimeFilter' },
                { name: 'FA_ACTL_ARRIVALTIME'    ,  displayName: '真實抵達時間', cellFilter: 'datetimeFilter' },
                { name: 'FA_ARRIVAL_REMK'        ,  displayName: '狀態', width: 80, cellTemplate: $templateCache.get('accessibilityToArrivalRemark') },
                { name: 'OL_MASTER'              ,  displayName: '主號', width: 120 },
                { name: 'OL_COUNTRY'             ,  displayName: '起運國別', width: 80 },
                // { name: 'ITEM_LIST'           ,  displayName: '報機單', enableFiltering: false, width: '8%', cellTemplate: $templateCache.get('accessibilityToOperaForJob001') },
                { name: 'FLIGHT_ITEM_LIST'       ,  displayName: '銷艙單', enableFiltering: false, width: '8%', cellTemplate: $templateCache.get('accessibilityToOperaForJob002') },
                // { name: 'DELIVERY_ITEM_LIST'  ,  displayName: '派送單', enableFiltering: false, width: '8%', cellTemplate: $templateCache.get('accessibilityToOperaForJob003') },
                { name: 'Options'                ,  displayName: '操作', width: '14%', enableCellEdit: false, enableFiltering: false, cellTemplate: $templateCache.get('accessibilityToMSForAssistantJobs') }
            ],
            enableFiltering: true,
            enableSorting: false,
            enableColumnMenus: false,
            // enableVerticalScrollbar: false,
            paginationPageSizes: [10, 25, 50],
            paginationPageSize: 10,
            onRegisterApi: function(gridApi){
                $vm.flightItemGridApi = gridApi;
            }
        },
        gridMethodForPullGoods : {
            //編輯
            modifyData : function(row){
                console.log(row);

                var modalInstance = $uibModal.open({
                    animation: true,
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    templateUrl: 'modifyPullGoodsModalContent.html',
                    controller: 'ModifyPullGoodsModalInstanceCtrl',
                    controllerAs: '$ctrl',
                    // size: 'lg',
                    resolve: {
                        items: function () {
                            return row.entity;
                        }
                    }
                });

                modalInstance.result.then(function(selectedItem) {
                    console.log(selectedItem);

                    var _d = new Date();

                    RestfulApi.UpdateMSSQLData({
                        updatename: 'Update',
                        table: 19,
                        params: {
                            PG_MOVED : true,
                            PG_MASTER : selectedItem.PG_MASTER,
                            PG_FLIGHTNO : selectedItem.PG_FLIGHTNO,
                            PG_UP_USER : $vm.profile.U_ID,
                            PG_UP_DATETIME : $filter('date')(_d, 'yyyy-MM-dd HH:mm:ss')
                        },
                        condition: {
                            PG_SEQ : selectedItem.PG_SEQ,
                            PG_BAGNO : selectedItem.PG_BAGNO
                        }
                    }).then(function (res) {
                        toaster.pop('success', '訊息', '更新成功', 3000);
                        LoadPullGoods();
                    });

                }, function() {
                    // $log.info('Modal dismissed at: ' + new Date());
                });
            },
            //取消
            cancelData : function(row){
                console.log(row);

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
                            return row.entity;
                        },
                        show: function(){
                            return {
                                title : "是否取消"
                            };
                        }
                    }
                });

                modalInstance.result.then(function(selectedItem) {
                    // $ctrl.selected = selectedItem;
                    console.log(selectedItem);

                    RestfulApi.DeleteMSSQLData({
                        deletename: 'Delete',
                        table: 19,
                        params: {
                            PG_SEQ : selectedItem.PG_SEQ,
                            PG_BAGNO : selectedItem.PG_BAGNO
                        }
                    }).then(function (res) {
                        toaster.pop('success', '訊息', '取消成功', 3000);
                        LoadPullGoods();
                    });

                }, function() {
                    // $log.info('Modal dismissed at: ' + new Date());
                });
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
                { name: 'Options'       , displayName: '操作', cellTemplate: $templateCache.get('accessibilityToMCForPullGoods') }
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

    function LoadFlightArrival(){
        RestfulApi.SearchMSSQLData({
            querymain: 'assistantJobs',
            queryname: 'SelectFlightArrival',
            params: {
                FA_FLIGHTDATE : $filter('date')(new Date(), 'yyyy-MM-dd')
            }
        }).then(function (res){
            console.log(res["returnData"]);
            $vm.flightArrivalData = res["returnData"];
        }); 
    };

    function LoadFlightItem(){
        RestfulApi.SearchMSSQLData({
            querymain: 'assistantJobs',
            queryname: 'SelectOrderList'
        }).then(function (res){
            console.log(res["returnData"]);
            $vm.flightItemData = res["returnData"];
        }); 
    };

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
.controller('ModifyPullGoodsModalInstanceCtrl', function ($uibModalInstance, items) {
    var $ctrl = this;
    $ctrl.mdData = angular.copy(items);

    $ctrl.ok = function() {
        $uibModalInstance.close($ctrl.mdData);
    };

    $ctrl.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
});