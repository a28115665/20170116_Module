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
                    },
                    depart: function($q) {
                        var deferred = $q.defer();

                        SysCode.get('Depart').then(function (res){
                            var finalData = [];
                            for(var i in res){
                                finalData.push({
                                    value: i, 
                                    label: res[i]
                                });
                            }
                            deferred.resolve(finalData);
                        }, function (err){
                            deferred.reject(err);
                        })

                        return deferred.promise
                    }
                }
            });

            modalInstance.result.then(function(selectedItem) {
                console.log(selectedItem);

                var _tasks = [];
                _tasks.push({
                    crudType: 'Delete',
                    table: 4,
                    params: {
                        UG_GROUP : $vm.vmData.SG_GCODE
                    }
                });

                for(var i in selectedItem){
                    _tasks.push({
                        crudType: 'Insert',
                        table: 4,
                        params: {
                            UG_ID : selectedItem[i].U_ID,
                            UG_GROUP : $vm.vmData.SG_GCODE
                        }
                    });
                }

                RestfulApi.CRUDMSSQLDataByTask(_tasks).then(function (res){
                    console.log(res);
                }, function (err){
                    
                });
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
.controller('AddGroupPeopleModalInstanceCtrl', function ($uibModalInstance, RestfulApi, vmData, $filter, $timeout, uiGridConstants, depart) {
    var $ctrl = this;
    $ctrl.vmData = vmData;
    $ctrl.depart = depart;

    $ctrl.mdData = [];

    RestfulApi.CRUDMSSQLDataByTask([
        {
            crudType: 'Select',
            querymain: 'group',
            queryname: 'SelectAllUserInfoNotWithAdmin'
        },
        {  
            crudType: 'Select',
            querymain: 'group',
            queryname: 'SelectUserGroup',
            params: {
                UG_GROUP : $ctrl.vmData.SG_GCODE
            }
        }
    ]).then(function (res){
        // console.log(res);
        // 顯示所有帳號
        $ctrl.mdData = res["returnData"][0];
        // 把已被選取的帳號打勾
        $timeout(function() {
            if($ctrl.mdDataGridApi.selection.selectRow){
                for(var i in res["returnData"][1]){
                    $ctrl.mdDataGridApi.selection.selectRow($filter('filter')($ctrl.mdData, {U_ID: res["returnData"][1][i].UG_ID})[0]);
                }
            }
        });
    }, function (err){
        
    });

    $ctrl.mdDataOptions = {
        data:  '$ctrl.mdData',
        columnDefs: [
            { name: 'U_ID'     ,  displayName: '帳號' },
            { name: 'U_NAME'   ,  displayName: '名稱' },
            { name: 'U_JOB'    ,  displayName: '職稱' },
            { name: 'U_DEPART' ,  displayName: '單位', cellFilter: 'departFilter', filter: 
                {
                    term: null,
                    type: uiGridConstants.filter.SELECT,
                    selectOptions: $ctrl.depart
                }
            }
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