"use strict";

angular.module('app.settings').controller('GroupCtrl', function ($scope, $stateParams, $state, AuthApi, Session, toaster, $uibModal, $templateCache, $filter, SysCode, RestfulApi) {
    // console.log($stateParams);
    

	var $vm = this;

	angular.extend(this, {
        Init : function(){
            if($stateParams.data == null) ReturnToBillboardEditorPage();
        },
        profile : Session.Get(),
        vmData : $stateParams.data,
        Return : function(){
            ReturnToBillboardEditorPage();
        },
        Modify : function(){

        }
	})

	function ReturnToBillboardEditorPage(){
        $state.transitionTo("app.settings.accountmanagement");
    };

})