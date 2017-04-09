"use strict";

angular.module('app.settings').controller('AccountManagementCtrl', function ($scope, $stateParams, $state, AuthApi, Session, toaster, $uibModal, $templateCache, $filter, SysCode, RestfulApi) {

	var $vm = this;
    // console.log(Account.get());

	angular.extend(this, {
        profile : Session.Get(),
        defaultTab : 'hr2',
        TabSwitch : function(pTabID){
            return pTabID == $vm.defaultTab ? 'active' : '';
        },
        LoadData : function(){
            switch($vm.defaultTab){
                case 'hr1':
                    LoadAccount();
                    break;
                case 'hr2':
                    LoadGroup();
                    break;
            }
        },
        gridAccountMethod : {
            //編輯
            modifyData : function(row){
                console.log(row);
            },
            //刪除
            deleteData : function(row){
                console.log(row);
            }
        },
        accountManagementOptions : {
            data: '$vm.accountData',
            columnDefs: [
                { name: 'U_STS'    ,  displayName: '離職', cellFilter: 'booleanFilter' },
                { name: 'U_CHECK'  ,  displayName: '認證', cellFilter: 'booleanFilter' },
                { name: 'U_ID'     ,  displayName: '帳號' },
                { name: 'U_NAME'   ,  displayName: '名稱' },
                { name: 'U_EMAIL'  ,  displayName: '信箱' },
                { name: 'U_PHONE'  ,  displayName: '電話' },
                { name: 'U_JOB'    ,  displayName: '職稱' },
                { name: 'U_ROLE'   ,  displayName: '角色', cellFilter: 'roleFilter' },
                { name: 'U_DEPART' ,  displayName: '單位', cellFilter: 'departFilter' },
                { name: 'Options'  ,  displayName: '操作', cellTemplate: $templateCache.get('accessibilityToMDForAccount') }
            ],
            enableFiltering: false,
            enableSorting: false,
            enableColumnMenus: false,
            // enableVerticalScrollbar: false,
            paginationPageSizes: [10, 25, 50],
            paginationPageSize: 10,
            onRegisterApi: function(gridApi){
                $vm.accountManagementGridApi = gridApi;
            }
        },
        gridGroupMethod : {
            //編輯
            modifyData : function(row){
                // console.log(row);
                $state.transitionTo("app.settings.accountmanagement.group", {
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
                        table: 6,
                        params: {
                            SG_GCODE : selectedItem.SG_GCODE
                        }
                    }).then(function (res) {
                        if(res["returnData"] == 1){
                            LoadGroup();
                        }
                    });
                }, function() {
                    // $log.info('Modal dismissed at: ' + new Date());
                });
            }
        },
        groupManagementOptions : {
            data: '$vm.groupData',
            columnDefs: [
                { name: 'SG_TITLE' ,  displayName: '群組名稱' },
                { name: 'SG_DESC'  ,  displayName: '群組敘述' },
                { name: 'SG_STS'   ,  displayName: '作廢', cellFilter: 'booleanFilter' },
                { name: 'Options'  ,  displayName: '操作', cellTemplate: $templateCache.get('accessibilityToMDForGroup') }
            ],
            enableFiltering: false,
            enableSorting: false,
            enableColumnMenus: false,
            paginationPageSizes: [10, 25, 50],
            paginationPageSize: 10,
            onRegisterApi: function(gridApi){
                $vm.groupManagementOptions = gridApi;
            }
        },
        AddAccount : function(){
        	var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'addAccountModalContent.html',
                controller: 'AddAccountModalInstanceCtrl',
                controllerAs: '$ctrl',
                // size: 'lg',
                // appendTo: parentElem,
                resolve: {
                    role: function () {
                        return SysCode.get('Role');
                    },
                    depart: function () {
                        return SysCode.get('Depart');;
                    }
                }
            });

            modalInstance.result.then(function(selectedItem) {
            	console.log(selectedItem);

                RestfulApi.InsertMSSQLData({
                    insertname: 'Insert',
                    table: 0,
                    params: {
                        U_ID          : selectedItem.U_ID,
                        U_NAME        : selectedItem.U_NAME,
                        U_PW          : selectedItem.U_PW,
                        U_EMAIL       : selectedItem.U_EMAIL,
                        U_ROLE        : selectedItem.U_ROLE,
                        U_DEPART      : selectedItem.U_DEPART,
                        U_CR_USER     : $vm.profile.U_ID,
                        U_CR_DATETIME : new Date()
                    }
                }).then(function(res) {
                    console.log(res);

                    if(res["returnData"] == 1){
                    	LoadAccount();
                    }

                    // $state.reload()
                });
            }, function() {
                // $log.info('Modal dismissed at: ' + new Date());
            });
        },
        AddGroup : function(){
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'addGroupModalContent.html',
                controller: 'AddGroupModalInstanceCtrl',
                controllerAs: '$ctrl',
            });

            modalInstance.result.then(function(selectedItem) {
                // console.log(selectedItem);

                RestfulApi.InsertMSSQLData({
                    insertname: 'Insert',
                    table: 6,
                    params: {
                        SG_TITLE : selectedItem.TITLE,
                        SG_DESC  : selectedItem.DESC
                    }
                }).then(function(res) {
                    console.log(res);

                    if(res["returnData"] == 1){
                        LoadGroup();
                    }

                    // $state.reload()
                });
            }, function() {
                // $log.info('Modal dismissed at: ' + new Date());
            });
        }
	})

	function LoadAccount(){    
        RestfulApi.SearchMSSQLData({
            querymain: 'accountManagement',
            queryname: 'SelectAllUserInfoNotWithAdmin'
        }).then(function (res){
            $vm.accountData = res["returnData"];
        }).finally(function() {
            HandleWindowResize($vm.accountManagementGridApi);
        });    
	}

    function LoadGroup(){    
        RestfulApi.SearchMSSQLData({
            querymain: 'accountManagement',
            queryname: 'SelectAllGroup'
        }).then(function (res){
            $vm.groupData = res["returnData"];
        }).finally(function() {
            HandleWindowResize($vm.groupManagementOptions);
        });    
    }

})
.controller('AddAccountModalInstanceCtrl', function ($uibModalInstance, role, depart) {
    var $ctrl = this;
    $ctrl.role = role;
    $ctrl.depart = depart;
    $ctrl.items = {};
    $ctrl.items["U_ID"] = "User2";
	$ctrl.items["U_NAME"] = "測試二號";
	$ctrl.items["U_PW"] = "Test#1";
	$ctrl.items["U_EMAIL"] = "aaa@test.com";
	$ctrl.items["U_ROLE"] = "SUser";
	$ctrl.items["U_DEPART"] = "003";

    $ctrl.ok = function() {
        $uibModalInstance.close($ctrl.items);
    };

    $ctrl.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
})
.controller('AddGroupModalInstanceCtrl', function ($uibModalInstance) {
    var $ctrl = this;

    $ctrl.ok = function() {
        $uibModalInstance.close($ctrl.items);
    };

    $ctrl.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
});