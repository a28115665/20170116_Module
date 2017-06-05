"use strict";

angular.module('app.selfwork').controller('AssistantJobsCtrl', function ($scope, $stateParams, $state, AuthApi, Session, toaster, $uibModal, $templateCache, RestfulApi, $filter) {
    
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
            //編輯
            modifyData : function(row){
                console.log(row);

                var modalInstance = $uibModal.open({
                    animation: true,
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    templateUrl: 'modifyModalContent.html',
                    controller: 'ModifyModalInstanceCtrl',
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
                { name: 'Options'       , displayName: '操作', cellTemplate: $templateCache.get('accessibilityToMC') }
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
.controller('ModifyModalInstanceCtrl', function ($uibModalInstance, items) {
    var $ctrl = this;
    $ctrl.mdData = angular.copy(items);

    $ctrl.ok = function() {
        $uibModalInstance.close($ctrl.mdData);
    };

    $ctrl.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
});