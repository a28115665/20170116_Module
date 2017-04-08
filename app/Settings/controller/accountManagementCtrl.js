"use strict";

angular.module('app.settings').controller('AccountManagementCtrl', function ($scope, $stateParams, $state, AuthApi, Session, toaster, $uibModal, $templateCache, $filter, Account, SysCode, RestfulApi) {

	var $vm = this;
    // console.log(Account.get());
    LoadAccount();

	angular.extend(this, {
        profile : Session.Get(),
        // accountData : Account.get().then(function (res){
        //     return res;
        // }),
        // roleData : role,
        gridMethod : {
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
                { name: 'Options'  ,  displayName: '操作', cellTemplate: $templateCache.get('accessibilityToMD') }
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
        }
	})

	function LoadAccount(){        
        Account.get().then(function (res){
            $vm.accountData = res;
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