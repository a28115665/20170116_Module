"use strict";

angular.module('app.settings').controller('ExternalManagementCtrl', function ($scope, $stateParams, $state, AuthApi, Session, toaster, $uibModal) {

    var $vm = this;

    angular.extend(this, {
        profile : Session.Get()
    });

})