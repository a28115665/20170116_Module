"use strict";

angular.module('app.settings').controller('AccountCtrl', function ($scope, $stateParams, $state, AuthApi, Session, toaster, $uibModal, bool, depart, role) {

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
        Return : function(){
        	ReturnToAccountManagementPage();
        },
        Add : function(){
        	console.log($vm.vmData);
        },
        Update : function(){
        	console.log($vm.vmData);
        }
    });

    function ReturnToAccountManagementPage(){
        // if(_tasks.length > 0){
        //     toaster.success("狀態", "資料上傳成功", 3000);    
        // }
        $state.transitionTo("app.settings.accountmanagement");
    };

});