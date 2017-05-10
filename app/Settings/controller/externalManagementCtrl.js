"use strict";

angular.module('app.settings').controller('ExternalManagementCtrl', function ($scope, $stateParams, $state, AuthApi, Session, toaster, $uibModal, RestfulApi, uiGridConstants, $templateCache, $filter, boolFilter, compyFilter) {

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
                    LoadCustInfo();
                    break;
                case 'hr2':
                    LoadCompyInfo();
                    break;
            }
        },
        gridCustInfoMethod : {
            //編輯
            modifyData : function(row){
                console.log(row);
                $state.transitionTo("app.settings.externalmanagement.exaccount", {
                    data: row.entity
                });
            },
            //刪除
            deleteData : function(row){
                console.log(row);

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
                            return row.entity;
                        }
                    }
                });

                modalInstance.result.then(function(selectedItem) {
                    console.log(selectedItem);

                    RestfulApi.DeleteMSSQLData({
                        deletename: 'Delete',
                        table: 7,
                        params: {
                            CI_ID : selectedItem.CI_ID
                        }
                    }).then(function (res) {
                        if(res["returnData"] == 1){
                            LoadCustInfo();
                        }
                    });
                }, function() {
                    // $log.info('Modal dismissed at: ' + new Date());
                });
            }
        },
        custInfoOptions : {
            data: '$vm.custInfoData',
            columnDefs: [
                { name: 'CI_STS'    ,  displayName: '離職', cellFilter: 'booleanFilter', filter: 
                    {
                        term: null,
                        type: uiGridConstants.filter.SELECT,
                        selectOptions: boolFilter
                    }
                },
                { name: 'CI_ID'    ,  displayName: '帳號' },
                { name: 'CI_NAME'  ,  displayName: '名稱' },
                { name: 'CI_COMPY' ,  displayName: '公司名稱', cellFilter: 'compyFilter', filter: 
                    {
                        term: null,
                        type: uiGridConstants.filter.SELECT,
                        selectOptions: compyFilter
                    }
                },
                { name: 'Options'  ,  displayName: '操作', enableFiltering: false, cellTemplate: $templateCache.get('accessibilityToMDForCustInfo') }
            ],
            enableFiltering: true,
            enableSorting: false,
            enableColumnMenus: false,
            // enableVerticalScrollbar: false,
            paginationPageSizes: [10, 25, 50],
            paginationPageSize: 10,
            onRegisterApi: function(gridApi){
                $vm.custInfoGridApi = gridApi;
            }
        },
        gridCompyInfoMethod : {
            //編輯
            modifyData : function(row){
                console.log(row);
                $state.transitionTo("app.settings.externalmanagement.excompy", {
                    data: row.entity
                });
            },
            //刪除
            deleteData : function(row){
                console.log(row);

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
                            return row.entity;
                        }
                    }
                });

                modalInstance.result.then(function(selectedItem) {
                    console.log(selectedItem);

                    RestfulApi.DeleteMSSQLData({
                        deletename: 'Delete',
                        table: 8,
                        params: {
                            CO_CODE : selectedItem.CO_CODE
                        }
                    }).then(function (res) {
                        if(res["returnData"] == 1){
                            LoadCustInfo();
                        }
                    });
                }, function() {
                    // $log.info('Modal dismissed at: ' + new Date());
                });
            }
        },
        compyInfoOptions : {
            data: '$vm.compyInfoData',
            columnDefs: [
                { name: 'CO_STS'    ,  displayName: '作廢', cellFilter: 'booleanFilter', filter: 
                    {
                        term: null,
                        type: uiGridConstants.filter.SELECT,
                        selectOptions: boolFilter
                    }
                },
                { name: 'CO_CODE'   ,  displayName: '公司代號' },
                { name: 'CO_NAME'   ,  displayName: '公司名稱' },
                { name: 'CO_NUMBER' ,  displayName: '公司統編' },
                { name: 'CO_ADDR'   ,  displayName: '公司地址' },
                { name: 'Options'   ,  displayName: '操作', enableFiltering: false, cellTemplate: $templateCache.get('accessibilityToMDForCompyInfo') }
            ],
            enableFiltering: true,
            enableSorting: false,
            enableColumnMenus: false,
            // enableVerticalScrollbar: false,
            paginationPageSizes: [10, 25, 50],
            paginationPageSize: 10,
            onRegisterApi: function(gridApi){
                $vm.compyInfoGridApi = gridApi;
            }
        },
        AddAccount : function(){

            $state.transitionTo("app.settings.externalmanagement.exaccount");

        },
        AddCompy : function(){
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'addCompyModalContent.html',
                controller: 'AddCompyModalInstanceCtrl',
                controllerAs: '$ctrl',
            });

            modalInstance.result.then(function(selectedItem) {
                // console.log(selectedItem);

                RestfulApi.InsertMSSQLData({
                    insertname: 'Insert',
                    table: 8,
                    params: {
                        CO_NAME : selectedItem.CO_NAME,
                        CO_NUMBER : selectedItem.CO_NUMBER,
                        CO_ADDR : selectedItem.CO_ADDR,
                        CO_CR_USER : $vm.profile.U_ID,
                        CO_CR_DATETIME : $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')
                    }
                }).then(function(res) {
                    console.log(res);

                    if(res["returnData"] == 1){
                        LoadCompyInfo();
                    }

                    // $state.reload()
                });
            }, function() {
                // $log.info('Modal dismissed at: ' + new Date());
            });
        }
    });

    function LoadCustInfo(){
        RestfulApi.SearchMSSQLData({
            querymain: 'externalManagement',
            queryname: 'SelectCustInfo'
        }).then(function (res){
            $vm.custInfoData = res["returnData"];
        }).finally(function() {
            HandleWindowResize($vm.custInfoGridApi);
            $vm.custInfoGridApi.grid.refresh();
        });

        // RestfulApi.CRUDMSSQLDataByTask([
        //     {
        //         crudType: 'Select',
        //         querymain: 'externalManagement',
        //         queryname: 'SelectCustInfo'
        //     },
        //     {
        //         crudType: 'Select',
        //         querymain: 'externalManagement',
        //         queryname: 'SelectCompyInfo',
        //         params: {
        //             CO_STS : false
        //         }
        //     }
        // ]).then(function (res) {
        //     console.log(res["returnData"]);
        //     $vm.custInfoData = res["returnData"][0];
        //     var _compyInfo = res["returnData"][1];

        //     for(var i in $vm.custInfoData){
        //         for(var j in _compyInfo){
        //             if($vm.custInfoData[i]["CI_COMPY"] == _compyInfo[j].CO_CODE){
        //                 $vm.custInfoData[i]["getCICOMPY"] = function(){
        //                     return 
        //                 };
        //             }
        //         }
        //     }
        // }, function (err) {
        //     console.log(err);
        // });
    }

    function LoadCompyInfo(){
        RestfulApi.SearchMSSQLData({
            querymain: 'externalManagement',
            queryname: 'SelectCompyInfo'
        }).then(function (res){
            $vm.compyInfoData = res["returnData"];
        }).finally(function() {
            HandleWindowResize($vm.compyInfoGridApi);
        });
    }

})
.controller('AddCompyModalInstanceCtrl', function ($uibModalInstance) {
    var $ctrl = this;

    $ctrl.ok = function() {
        $uibModalInstance.close($ctrl.items);
    };

    $ctrl.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
});