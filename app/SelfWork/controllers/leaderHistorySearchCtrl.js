"use strict";

angular.module('app.selfwork').controller('LeaderHistorySearchCtrl', function ($scope, $stateParams, $state, AuthApi, Session, toaster, $uibModal, $templateCache) {
    
    var $vm = this;

	angular.extend(this, {
        profile : Session.Get(),
        vmData : {},
        Cancel : function(){
            $vm.vmData = {};
        },
        Search : function(){
            console.log($vm.vmData);
        }
    });

});