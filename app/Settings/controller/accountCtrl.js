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
        }
    });

    function ReturnToAccountManagementPage(){
        // if(_tasks.length > 0){
        //     toaster.success("狀態", "資料上傳成功", 3000);    
        // }
        $state.transitionTo("app.settings.accountmanagement");
    };

});