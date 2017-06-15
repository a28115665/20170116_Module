"use strict";

angular.module('app.selfwork').controller('EmployeeHistorySearchCtrl', function ($scope, $stateParams, $state, AuthApi, Session, toaster, $uibModal, $templateCache, compy, bool) {
    
    var $vm = this;

	angular.extend(this, {
        profile : Session.Get(),
        vmData : {},
        boolData : bool,
        compyData : compy,
        Cancel : function(){
            $vm.vmData = {};
        },
        Search : function(){
            console.log($vm.vmData);
        }
    });

});