"use strict";

angular.module('app.settings').controller('AccountCtrl', function ($scope, $stateParams, $state, AuthApi, Session, toaster, $uibModal, RestfulApi, $filter, bool, role, userGrade) {

    var $vm = this,
        _tasks = [];

    angular.extend(this, {
    	Init : function(){
    		if($stateParams.data == null){
                $vm.vmData = {
                	U_ROLE : "SUser",
                	U_STS : bool[0].value,
                	U_CHECK : bool[0].value,
                    IU : "Add"
                }
            }else{
                $vm.vmData = $stateParams.data;
                $vm.vmData["IU"] = "Update";

                LoadUserDept();

                console.log($vm.vmData);
            }
    	},
        profile : Session.Get(),
        boolData : bool,
        roleData : role,
        gradeData : userGrade,
        ModifyPW : function(){
        	var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'modifyPWModalContent.html',
                controller: 'ModifyPWModalInstanceCtrl',
                controllerAs: '$ctrl',
                // size: 'lg',
                // appendTo: parentElem,
                resolve: {
                    pw: function () {
                        return $vm.vmData.U_PW;
                    }
                }
            });

            modalInstance.result.then(function(selectedItem) {
            	console.log(selectedItem);
            	$vm.vmData.U_PW = selectedItem;
                
            }, function() {
                // $log.info('Modal dismissed at: ' + new Date());
            });
        },
        Return : function(){
        	ReturnToAccountManagementPage();
        },
        Add : function(){
        	console.log($vm.vmData);

            // Insert此人Info
            _tasks.push({
                crudType: 'Insert',
                insertname: 'InsertByEncrypt',
                table: 0,
                params: {
                    U_ID          : $vm.vmData.U_ID,
                    U_PW          : $vm.vmData.U_PW,
                    U_NAME        : $vm.vmData.U_NAME,
                    U_PHONE       : $vm.vmData.U_PHONE,
                    U_ROLE        : $vm.vmData.U_ROLE,
                    U_EMAIL       : $vm.vmData.U_EMAIL,
                    U_GRADE       : $vm.vmData.U_GRADE,
                    U_JOB_AGENT   : $vm.vmData.U_JOB_AGENT,
                    U_STS         : $vm.vmData.U_STS,
                    U_CHECK       : $vm.vmData.U_CHECK,
                    U_CR_USER     : $vm.profile.U_ID,
                    U_CR_DATETIME : $filter('date')(new Date, 'yyyy-MM-dd HH:mm:ss')
                }
            });

            RestfulApi.CRUDMSSQLDataByTask(_tasks).then(function (res) {

                ReturnToAccountManagementPage();

            }, function (err) {

            });
        },
        Update : function(){
        	console.log($vm.vmData);

            // Update此人Info
            _tasks.push({
                crudType: 'Update',
                updatename: 'UpdateByEncrypt',
                table: 0,
                params: {
                    U_PW          : $vm.vmData.U_PW,
                    U_NAME        : $vm.vmData.U_NAME,
                    U_PHONE       : $vm.vmData.U_PHONE,
                    U_ROLE        : $vm.vmData.U_ROLE,
                    U_EMAIL       : $vm.vmData.U_EMAIL,
                    U_GRADE       : $vm.vmData.U_GRADE,
                    U_JOB_AGENT   : $vm.vmData.U_JOB_AGENT,
                    U_STS         : $vm.vmData.U_STS,
                    U_CHECK       : $vm.vmData.U_CHECK,
                    U_UP_USER     : $vm.profile.U_ID,
                    U_UP_DATETIME : $filter('date')(new Date, 'yyyy-MM-dd HH:mm:ss')
                },
                condition: {
                    U_ID          : $vm.vmData.U_ID
                }
            });
            
        	RestfulApi.CRUDMSSQLDataByTask(_tasks).then(function (res) {

    			ReturnToAccountManagementPage();

            }, function (err) {

            });
        },
        AddUserDept : function(){
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'addUserDept.html',
                controller: 'AddUserDeptModalInstanceCtrl',
                controllerAs: '$ctrl',
                size: 'lg',
                resolve: {
                    vmData: function () {
                        return $vm.vmData;
                    }
                }
            });

            modalInstance.result.then(function(selectedItem) {
                console.log(selectedItem);

                $vm.vmData.UserDept = angular.copy(selectedItem);

                // 初始化
                _tasks = [];

                // Delete此部門相關人員
                _tasks.push({
                    crudType: 'Delete',
                    table: 14,
                    params: {
                        UD_ID : $vm.vmData.U_ID
                    }
                });

                // Insert此部門相關人員
                for(var i in selectedItem){
                    _tasks.push({
                        crudType: 'Insert',
                        table: 14,
                        params: {
                            UD_ID : $vm.vmData.U_ID,
                            UD_DEPT : selectedItem[i].SUD_DEPT
                        }
                    });
                }

            }, function() {
                // $log.info('Modal dismissed at: ' + new Date());
            });
        }
    });

    function LoadUserDept(){
        RestfulApi.SearchMSSQLData({
            querymain: 'account',
            queryname: 'SelectUserDept',
            params: {
                UD_ID : $vm.vmData.U_ID
            }
        }).then(function (res){
            console.log(res["returnData"]);
            $vm.vmData.UserDept = res["returnData"];
        });
    };

    function ReturnToAccountManagementPage(){
        // if(_tasks.length > 0){
        //     toaster.success("狀態", "資料上傳成功", 3000);    
        // }
        $state.transitionTo("app.settings.accountmanagement");
    };

})
.controller('ModifyPWModalInstanceCtrl', function ($uibModalInstance, pw) {
    var $ctrl = this;
    $ctrl.mdData = {};

    /**
     * [CheckPW description]
     * N_PW : 當前密碼
     * M_PW : 更改密碼
     * C_PW : 確認密碼
     */
    $ctrl.CheckPW = function(){
    	var _check = true;

    	// N_PW必須輸入且正確
    	if(!angular.isUndefined($ctrl.mdData['N_PW']) && $ctrl.mdData['N_PW'] == pw){
	    	if(!angular.isUndefined($ctrl.mdData['M_PW']) && !angular.isUndefined($ctrl.mdData['C_PW'])){
	    		// 更改密碼 等於 確認密碼
		    	if($ctrl.mdData['M_PW'] == $ctrl.mdData['C_PW']){
		    		_check = false;
		    	}
	    	}
    	}

    	return _check;
    };

    $ctrl.ok = function() {
        $uibModalInstance.close($ctrl.mdData.C_PW);
    };

    $ctrl.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
})
.controller('AddUserDeptModalInstanceCtrl', function ($uibModalInstance, RestfulApi, $filter, $timeout, vmData) {
    var $ctrl = this;
    $ctrl.vmData = vmData;
    $ctrl.mdData = [];

    $ctrl.MdInit = function(){
        RestfulApi.SearchMSSQLData({
            querymain: 'account',
            queryname: 'SelectSysUserDept',
            params: {
                SUD_STS : false
            }
        }).then(function (res){
            console.log(res["returnData"]);
            // console.log(res);
            // 顯示所有帳號
            $ctrl.mdData = res["returnData"];
            // 把已被選取的帳號打勾
            $timeout(function() {
                if($ctrl.mdDataGridApi.selection.selectRow){
                    // console.log($ctrl.vmData["UserGroup"]);
                    for(var i in $ctrl.vmData["UserDept"]){
                        $ctrl.mdDataGridApi.selection.selectRow($filter('filter')($ctrl.mdData, {SUD_DEPT: $ctrl.vmData["UserDept"][i].SUD_DEPT})[0]);
                    }
                }
            });
        });
    }

    $ctrl.mdDataOptions = {
        data:  '$ctrl.mdData',
        columnDefs: [
            { name: 'SUD_DEPT'  ,  displayName: '部門代號'},
            { name: 'SUD_DLVL'  ,  displayName: '部門層級'},
            { name: 'SUD_DPATH' ,  displayName: '層級路徑'},
            { name: 'SUD_NAME'  ,  displayName: '部門名稱'}
        ],
        enableSorting: false,
        enableColumnMenus: false,
        enableFiltering: true,
        enableRowSelection: true,
        enableSelectAll: true,
        selectionRowHeaderWidth: 35,
        paginationPageSizes: [10, 25, 50],
        paginationPageSize: 10,
        onRegisterApi: function(gridApi){ 
            $ctrl.mdDataGridApi = gridApi;
        } 
    };

    $ctrl.ok = function() {
        $uibModalInstance.close($ctrl.mdDataGridApi.selection.getSelectedRows());
    };

    $ctrl.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
});