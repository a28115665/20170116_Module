"use strict";

angular.module('app.concerns').controller('BanCtrl', function ($scope, $stateParams, $state, AuthApi, Session, toaster, $uibModal, $templateCache, RestfulApi, $filter, uiGridConstants, bool, boolFilter, compy) {
    
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
                    LoadBLFO();
                    break;
                case 'hr2':
                    LoadBLFL();
                    break;
            }
        },
        gridMethodForBLFO : {
            // 編輯
            modifyData : function(row){
                console.log(row);

                // var modalInstance = $uibModal.open({
                //     animation: true,
                //     ariaLabelledBy: 'modal-title',
                //     ariaDescribedBy: 'modal-body',
                //     templateUrl: 'banMemberModalContent.html',
                //     controller: 'BanMemberModalInstanceCtrl',
                //     controllerAs: '$ctrl',
                //     // size: 'lg',
                //     // appendTo: parentElem,
                //     resolve: {
                //         vmData: function() {
                //             return row.entity;
                //         },
                //         bool: function() {
                //             return bool;
                //         }
                //     }
                // });

                // modalInstance.result.then(function(selectedItem) {
                //     console.log(selectedItem);

                //     RestfulApi.UpdateMSSQLData({
                //         updatename: 'Update',
                //         table: 12,
                //         params: {
                //             BLFL_SENDNAME    : selectedItem.BLFL_SENDNAME,
                //             BLFL_GETNAME     : selectedItem.BLFL_GETNAME,
                //             BLFL_GETADDRESS  : selectedItem.BLFL_GETADDRESS,
                //             BLFL_TRACK       : selectedItem.BLFL_TRACK,
                //             BLFL_CR_USER     : $vm.profile.U_ID,
                //             BLFL_CR_DATETIME : $filter('date')(new Date, 'yyyy-MM-dd HH:mm:ss')
                //         },
                //         condition: {
                //             BLFL_ID : selectedItem.BLFL_ID
                //         }
                //     }).then(function (res) {

                //         LoadBLFL();

                //     }, function (err) {

                //     });

                // }, function() {
                //     // $log.info('Modal dismissed at: ' + new Date());
                // });
            }
        },
        blfoOptions : {
            data: '$vm.blfoData',
            columnDefs: [
                { name: 'a',        displayName: '關注人名' },
                { name: 'b',        displayName: '關注地址' },
                { name: 'Options',  displayName: '操作', width: '150', enableFiltering: false, cellTemplate: $templateCache.get('accessibilityToMForBLFO') }
            ],
            enableFiltering: true,
            enableSorting: false,
            enableColumnMenus: false,
            // enableVerticalScrollbar: false,
            paginationPageSizes: [10, 25, 50],
            paginationPageSize: 10,
            onRegisterApi: function(gridApi){
                $vm.blfoGridApi = gridApi;
            }
        },
        gridMethodForBLFL : {
            // 編輯
            modifyData : function(row){
                console.log(row);

                var modalInstance = $uibModal.open({
                    animation: true,
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    templateUrl: 'banMemberModalContent.html',
                    controller: 'BanMemberModalInstanceCtrl',
                    controllerAs: '$ctrl',
                    // size: 'lg',
                    // appendTo: parentElem,
                    resolve: {
                        vmData: function() {
                            return row.entity;
                        },
                        bool: function() {
                            return bool;
                        }
                    }
                });

                modalInstance.result.then(function(selectedItem) {
                    console.log(selectedItem);

                    RestfulApi.UpdateMSSQLData({
                        updatename: 'Update',
                        table: 12,
                        params: {
                            BLFL_SENDNAME    : selectedItem.BLFL_SENDNAME,
                            BLFL_GETNAME     : selectedItem.BLFL_GETNAME,
                            BLFL_GETADDRESS  : selectedItem.BLFL_GETADDRESS,
                            BLFL_TRACK       : selectedItem.BLFL_TRACK,
                            BLFL_CR_USER     : $vm.profile.U_ID,
                            BLFL_CR_DATETIME : $filter('date')(new Date, 'yyyy-MM-dd HH:mm:ss')
                        },
                        condition: {
                            BLFL_ID : selectedItem.BLFL_ID
                        }
                    }).then(function (res) {

                        LoadBLFL();

                    }, function (err) {

                    });

                }, function() {
                    // $log.info('Modal dismissed at: ' + new Date());
                });
            }
        },
        blflOptions : {
            data:  '$vm.blflData',
            columnDefs: [
                { name: 'BLFL_SENDNAME'   , displayName: '寄件人公司' },
                { name: 'BLFL_GETNAME'    , displayName: '收件人或公司' },
                { name: 'BLFL_GETADDRESS' , displayName: '收件人地址' },
                { name: 'BLFL_TRACK'      , displayName: '追蹤', cellFilter: 'booleanFilter', filter: 
                    {
                        term: null,
                        type: uiGridConstants.filter.SELECT,
                        selectOptions: boolFilter
                    }
                },
                { name: 'options',  displayName: '操作', width: '100', enableFiltering: false, cellTemplate: $templateCache.get('accessibilityToMForBLFL') }
            ],
            enableFiltering: true,
            enableSorting: false,
            enableColumnMenus: false,
            // enableVerticalScrollbar: false,
            paginationPageSizes: [10, 25, 50],
            paginationPageSize: 10,
            onRegisterApi: function(gridApi){
                $vm.blflGridApi = gridApi;
            }
        },
        AddBLFL : function() {

            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'banMemberModalContent.html',
                controller: 'BanMemberModalInstanceCtrl',
                controllerAs: '$ctrl',
                // size: 'lg',
                // appendTo: parentElem,
                resolve: {
                    vmData: function() {
                        return {
                            BLFL_TRACK : true
                        };
                    },
                    bool: function() {
                        return bool;
                    }
                }
            });

            modalInstance.result.then(function(selectedItem) {
                console.log(selectedItem);

                RestfulApi.InsertMSSQLData({
                    insertname: 'Insert',
                    table: 12,
                    params: {
                        BLFL_SENDNAME    : selectedItem.BLFL_SENDNAME,
                        BLFL_GETNAME     : selectedItem.BLFL_GETNAME,
                        BLFL_GETADDRESS  : selectedItem.BLFL_GETADDRESS,
                        BLFL_TRACK       : selectedItem.BLFL_TRACK,
                        BLFL_CR_USER     : $vm.profile.U_ID,
                        BLFL_CR_DATETIME : $filter('date')(new Date, 'yyyy-MM-dd HH:mm:ss')
                    }
                }).then(function(res) {
                    // console.log(res);

                    LoadBLFL();

                    // $state.reload()
                });
            }, function() {
                // $log.info('Modal dismissed at: ' + new Date());
            });
        },
        DeleteBLFL : function(){
            console.log($vm.blflGridApi.selection.getSelectedRows());

            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'isDelete.html',
                controller: 'IsDeleteModalInstanceCtrl',
                controllerAs: '$ctrl',
                size: 'sm',
                resolve: {
                    items: function () {
                        return $vm.blflGridApi.selection.getSelectedRows();
                    }
                }
            });

            modalInstance.result.then(function(selectedItem) {
                console.log(selectedItem);

                var _tasks = [];

                for(var i in selectedItem){
                    _tasks.push({
                        crudType: 'Delete',
                        table: 12,
                        params: {
                            BLFL_ID : selectedItem[i].BLFL_ID
                        }
                    });
                }

                RestfulApi.CRUDMSSQLDataByTask(_tasks).then(function (res) {
                    toaster.pop('success', '訊息', '名單成員刪除成功', 3000);
                    LoadBLFL();
                }, function (err) {

                });
            }, function() {
                // $log.info('Modal dismissed at: ' + new Date());
            });
        }
    });

    function LoadBLFO(){
        RestfulApi.SearchMSSQLData({
            querymain: 'ban',
            queryname: 'SelectBLFO'
        }).then(function (res){
            console.log(res["returnData"]);
            $vm.blfoData = res["returnData"];
        }).finally(function() {
            HandleWindowResize($vm.blfoGridApi);
        }); 
    }

    function LoadBLFL(){
        RestfulApi.SearchMSSQLData({
            querymain: 'ban',
            queryname: 'SelectBLFL'
        }).then(function (res){
            console.log(res["returnData"]);
            $vm.blflData = res["returnData"];
        }).finally(function() {
            HandleWindowResize($vm.blflGridApi);
        }); 
    }

})
.controller('BanMemberModalInstanceCtrl', function ($uibModalInstance, vmData, bool) {
    var $ctrl = this;
    $ctrl.bool = bool;
    $ctrl.mdData = vmData;

    /**
     * [CheckEmpty description]
     * 檢核
     */
    // $ctrl.CheckEmpty = function() {
    //     var _flag = true;

    //     if(!angular.equals($ctrl.mdData['SendName'], '') && !angular.isUndefined($ctrl.mdData['SendName'])) _flag = false;
    //     if(!angular.equals($ctrl.mdData['GetName'], '') && !angular.isUndefined($ctrl.mdData['GetName'])) _flag = false;
    //     if(!angular.equals($ctrl.mdData['GetAddress'], '') && !angular.isUndefined($ctrl.mdData['GetAddress'])) _flag = false;

    //     return _flag;
    // };

    $ctrl.ok = function() {
        $uibModalInstance.close($ctrl.mdData);
    };

    $ctrl.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
});