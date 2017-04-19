"use strict";

angular.module('app.settings').controller('ExAccountCtrl', function ($scope, $stateParams, $state, AuthApi, Session, toaster, $uibModal, $templateCache, $filter, SysCode, RestfulApi, bool, compy) {

	var $vm = this;
    // console.log(Account.get());

	angular.extend(this, {
        Init : function(){
            if($stateParams.data == null){
                $vm.vmData = {
                	CI_STS : false,
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
        compyData : compy,
        Return : function(){
        	ReturnToExternalManagementPage();
        },
        Add : function(){

        },
        Update : function(){

        }
	})

    function ReturnToExternalManagementPage(){
        $state.transitionTo("app.settings.externalmanagement");
    };

});