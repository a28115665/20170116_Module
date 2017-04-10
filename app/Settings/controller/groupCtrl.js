"use strict";

angular.module('app.settings').controller('GroupCtrl', function ($scope, $stateParams, $state, AuthApi, Session, toaster, $uibModal, $templateCache, $filter, SysCode, RestfulApi, bool) {
    // console.log($stateParams);
    
	var $vm = this;

	angular.extend(this, {
        Init : function(){
            // 不正常登入此頁面
            if($stateParams.data == null) ReturnToBillboardEditorPage();
        },
        profile : Session.Get(),
        boolData : bool,
        vmData : $stateParams.data,
        AddGroupPeople : function(){
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'addGroupPeople.html',
                controller: 'AddGroupPeopleModalInstanceCtrl',
                controllerAs: '$ctrl',
                size: 'lg',
                resolve: {
                    vmData: function () {
                        return $vm.vmData;
                    }
                }
            });

            modalInstance.result.then(function(selectedItem) {
                console.log(selectedItem);

                // RestfulApi.DeleteMSSQLData({
                //     deletename: 'Delete',
                //     table: 6,
                //     params: {
                //         SG_GCODE : selectedItem.SG_GCODE
                //     }
                // }).then(function (res) {
                //     if(res["returnData"] == 1){
                //         LoadGroup();
                //     }
                // });
            }, function() {
                // $log.info('Modal dismissed at: ' + new Date());
            });
        },
        Return : function(){
            ReturnToBillboardEditorPage();
        },
        Update : function(){

        }
	})

	function ReturnToBillboardEditorPage(){
        $state.transitionTo("app.settings.accountmanagement");
    };

})
.controller('AddGroupPeopleModalInstanceCtrl', function ($uibModalInstance, RestfulApi, vmData) {
    var $ctrl = this;
    $ctrl.vmData = vmData;

    $ctrl.mdData = [];

    RestfulApi.SearchMSSQLData({
        querymain: 'group',
        queryname: 'SelectAllUserInfoNotWithAdmin'
    }).then(function (res){
        $ctrl.mdData = res["returnData"];
        // console.log($ctrl.mdData);
    });   

    RestfulApi.SearchMSSQLData({
        querymain: 'group',
        queryname: 'SelectSysGroup',
        params: {
            UG_GROUP : $ctrl.vmData.SG_GCODE
        }
    }).then(function (res){
        // $ctrl.mdData = res["returnData"];
        console.log(res["returnData"]);
    });

    $ctrl.mdDataOptions = {
        data:  '$ctrl.mdData',
        columnDefs: [
            // { name: 'U_STS'    ,  displayName: '離職', cellFilter: 'booleanFilter' },
            // { name: 'U_CHECK'  ,  displayName: '認證', cellFilter: 'booleanFilter' },
            { name: 'U_ID'     ,  displayName: '帳號' },
            { name: 'U_NAME'   ,  displayName: '名稱' },
            // { name: 'U_EMAIL'  ,  displayName: '信箱' },
            // { name: 'U_PHONE'  ,  displayName: '電話' },
            { name: 'U_JOB'    ,  displayName: '職稱' },
            // { name: 'U_ROLE'   ,  displayName: '角色', cellFilter: 'roleFilter' },
            { name: 'U_DEPART' ,  displayName: '單位', cellFilter: 'departFilter' }
        ],
        enableSorting: false,
        enableColumnMenus: false,
        enableFiltering: true,
        enableRowSelection: true,
        enableSelectAll: true,
        selectionRowHeaderWidth: 35,
        paginationPageSizes: [10, 25, 50],
        paginationPageSize: 10,
        onRegisterApi: function(gridApi){ 
            $ctrl.mdDataGridApi = gridApi;
        } 
    };

    $ctrl.ok = function() {
        $uibModalInstance.close($ctrl.mdDataGridApi.selection.getSelectedRows());
    };

    $ctrl.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
});