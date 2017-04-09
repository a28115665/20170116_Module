"use strict";

angular.module('app.settings').controller('GroupCtrl', function ($scope, $stateParams, $state, AuthApi, Session, toaster, $uibModal, $templateCache, $filter, SysCode, RestfulApi) {

	var $vm = this;

	angular.extend(this, {
        profile : Session.Get(),
        Return : function(){
            ReturnToBillboardEditorPage();
        },
        Add : function(){

        }
	})

	function ReturnToBillboardEditorPage(){
        $state.transitionTo("app.settings.accountmanagement");
    };

})