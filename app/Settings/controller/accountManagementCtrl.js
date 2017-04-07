"use strict";

angular.module('app.settings').controller('AccountManagementCtrl', function ($scope, $stateParams, $state, AuthApi, Session, toaster, $uibModal, $templateCache, $filter, account, role, RestfulApi) {

	var $vm = this;
    console.log(account);
	angular.extend(this, {
        profile : Session.Get(),
        accountData : account,
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
                        return role;
                    },
                    depart: function (RestfulApi, $q) {
                        var deferred = $q.defer();

                        RestfulApi.SearchMSSQLData({
                            querymain: 'accountManagement',
                            queryname: 'SelectAllSysCode',
                            params: {
                                SC_TYPE : "Depart"
                            }
                        }).then(function (res){
                            var data = res["returnData"] || [],
                                finalData = {};

                            for(var i in data){
                                finalData[data[i].SC_CODE] = data[i].SC_DESC
                            }
                            
                            deferred.resolve(finalData);
                        }, function (err){
                            deferred.reject({});
                        });
                        
                        return deferred.promise;
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
                        U_Name        : selectedItem.U_Name,
                        U_PW          : selectedItem.U_PW,
                        U_Email       : selectedItem.U_Email,
                        U_Role        : selectedItem.U_Role,
                        U_Depart      : selectedItem.U_Depart,
                        U_Check       : false,
                        U_CR_User     : $vm.profile.U_ID,
                        U_CR_DateTime : new Date()
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
    	RestfulApi.SearchMSSQLData({
            querymain: 'accountManagement',
	        queryname: 'SelectAllUserInfoNotWithAdmin'
	    }).then(function (res){
        	console.log(res);
        	$vm.accountData = res["returnData"]
	    });
	}

})
.controller('AddAccountModalInstanceCtrl', function ($uibModalInstance, role, depart) {
    var $ctrl = this;
    $ctrl.role = role;
    $ctrl.depart = depart;
    console.log($ctrl.depart);
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