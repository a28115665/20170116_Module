"use strict";

angular.module('app.settings').controller('ExCompyCtrl', function ($scope, $stateParams, $state, AuthApi, Session, toaster, $uibModal, $filter, RestfulApi, bool) {

	var $vm = this;
    // console.log(Account.get());

	angular.extend(this, {
        Init : function(){
            // 不正常登入此頁面
            if($stateParams.data == null) ReturnToExternalManagementPage();
        },
        profile : Session.Get(),
        boolData : bool,
        vmData : $stateParams.data,
        Return : function(){
        	ReturnToExternalManagementPage();
        },
        Update : function(){
        	console.log($vm.vmData);
        	RestfulApi.UpdateMSSQLData({
                updatename: 'Update',
                table: 8,
                params: {
		        	CO_STS : $vm.vmData.CO_STS,
					CO_NAME : $vm.vmData.CO_NAME,
					CO_NUMBER : $vm.vmData.CO_NUMBER,
					CO_ADDR : $vm.vmData.CO_ADDR,
                    CO_UP_USER : $vm.profile.U_ID,
                    CO_UP_DATETIME : $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')
                },
                condition: {
                    CO_CODE : $vm.vmData.CO_CODE
                }
            }).then(function (res) {

                ReturnToExternalManagementPage();

            }, function (err) {

            });
        }
	})

	function ReturnToExternalManagementPage(){
        $state.transitionTo("app.settings.externalmanagement", null, { 
            reload: true, inherit: false, notify: true
        });
	}

});