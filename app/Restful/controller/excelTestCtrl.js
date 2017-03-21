"use strict";

angular.module('app.restful').controller('ExcelTestCtrl', function ($scope, $stateParams, $state, ToolboxApi, Session, toaster, $uibModal) {

    var $vm = this;

    ToolboxApi.ExportExcelByVar({}).then(function(res) {
        console.log(res);
    });
});
