"use strict";

angular.module('app.settings').controller('AccountCtrl', function ($scope, $stateParams, $state, AuthApi, Session, toaster, $uibModal, RestfulApi, $filter, bool, depart, role, job) {

    var $vm = this;

    angular.extend(this, {
    	Init : function(){
    		if($stateParams.data == null){
                $vm.vmData = {
                	U_ROLE : "SUser",
                	U_DEPART : "001",
                	U_STS : false,
                	U_CHECK : true,
                    IU : "Add"
                }
            }else{
                $vm.vmData = $stateParams.data;
                $vm.vmData["IU"] = "Update";

                console.log($vm.vmData);
            }
    	},
        profile : Session.Get(),
        boolData : bool,
        departData : depart,
        roleData : role,
        jobData : job,
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
        	RestfulApi.InsertMSSQLData({
                insertname: 'InsertByEncrypt',
                table: 0,
                params: {
                    U_ID          : $vm.vmData.U_ID,
                    U_PW          : $vm.vmData.U_PW,
                    U_NAME        : $vm.vmData.U_NAME,
                    U_PHONE       : $vm.vmData.U_PHONE,
                    U_ROLE        : $vm.vmData.U_ROLE,
                    U_EMAIL       : $vm.vmData.U_EMAIL,
                    U_JOB         : $vm.vmData.U_JOB,
                    U_JOB_AGENT   : $vm.vmData.U_JOB_AGENT,
                    U_DEPART      : $vm.vmData.U_DEPART,
                    U_STS         : $vm.vmData.U_STS,
                    U_CHECK       : $vm.vmData.U_CHECK,
                    U_CR_USER     : $vm.profile.U_ID,
                    U_CR_DATETIME : $filter('date')(new Date, 'yyyy-MM-dd HH:mm:ss')
                }
            }).then(function(res) {
                // console.log(res);

    			ReturnToAccountManagementPage();

                // $state.reload()
            });
        },
        Update : function(){
        	console.log($vm.vmData);

        	RestfulApi.UpdateMSSQLData({
                updatename: 'UpdateByEncrypt',
                table: 0,
                params: {
                    U_PW          : $vm.vmData.U_PW,
                    U_NAME        : $vm.vmData.U_NAME,
                    U_PHONE       : $vm.vmData.U_PHONE,
                    U_ROLE        : $vm.vmData.U_ROLE,
                    U_EMAIL       : $vm.vmData.U_EMAIL,
                    U_JOB         : $vm.vmData.U_JOB,
                    U_JOB_AGENT   : $vm.vmData.U_JOB_AGENT,
                    U_DEPART      : $vm.vmData.U_DEPART,
                    U_STS         : $vm.vmData.U_STS,
                    U_CHECK       : $vm.vmData.U_CHECK,
                    U_UP_USER     : $vm.profile.U_ID,
                    U_UP_DATETIME : $filter('date')(new Date, 'yyyy-MM-dd HH:mm:ss')
                },
                condition: {
                    U_ID          : $vm.vmData.U_ID
                }
            }).then(function (res) {

    			ReturnToAccountManagementPage();

            }, function (err) {

            });
        }
    });

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
});