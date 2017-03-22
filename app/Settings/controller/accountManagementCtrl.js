"use strict";

angular.module('app.settings').controller('AccountManagementCtrl', function ($scope, $stateParams, $state, AuthApi, Session, toaster, $uibModal, $templateCache, $filter, account, role, RestfulApi, Account) {

	var $vm = this;

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
            data:  '$vm.accountData',
            columnDefs: [
                { name: 'U_ID'     ,  displayName: '帳號' },
                { name: 'U_PW'     ,  displayName: '密碼' },
                { name: 'U_Name'   ,  displayName: '名稱' },
                { name: 'U_Email'  ,  displayName: '信箱' },
                { name: 'U_Role'   ,  displayName: '角色', cellFilter: 'roleFilter' },
                { name: 'U_Depart' ,  displayName: '單位', cellFilter: 'departFilter' },
                { name: 'U_Check'  ,  displayName: '開通', cellFilter: 'booleanFilter' },
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
                            queryname: 'SelectAllSysCode',
                            params: {
                                SC_Type : "Depart"
                            }
                        }).then(function (res){
                            var data = res["returnData"] || [],
                                finalData = {};

                            for(var i in data){
                                finalData[data[i].SC_Code] = data[i].SC_Desc
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
	        queryname: 'SelectAllUserInfoNotWithAdmin'
	    }).then(function (res){
        	// console.log(res);
        	$vm.accountData = res.data.returnData
	    });
	}

})
.controller('AddAccountModalInstanceCtrl', function ($uibModalInstance, role, depart) {
    var $ctrl = this;
    $ctrl.role = role;
    $ctrl.depart = depart;
    $ctrl.items = {};
    $ctrl.items["U_ID"] = "User2";
	$ctrl.items["U_Name"] = "測試二號";
	$ctrl.items["U_PW"] = "Test#1";
	$ctrl.items["U_Email"] = "aaa@test.com";
	$ctrl.items["U_Role"] = "SUser";
	$ctrl.items["U_Depart"] = "A03";

    $ctrl.ok = function() {
        $uibModalInstance.close($ctrl.items);
    };

    $ctrl.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
})