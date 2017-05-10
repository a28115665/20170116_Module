"use strict";

angular.module('app.settings').controller('GroupCtrl', function ($scope, $stateParams, $state, AuthApi, Session, toaster, $uibModal, $templateCache, $filter, SysCodeFilter, UserGradeFilter, RestfulApi, bool) {
    // console.log($stateParams);
    
	var $vm = this,
        _task = [];

	angular.extend(this, {
        Init : function(){
            // 不正常登入此頁面
            if($stateParams.data == null) ReturnToBillboardEditorPage();
            // 撈UserGroup資料
            else {
                LoadUserGroup();
            }
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
                    depart: function() {
                        return SysCodeFilter.get('Depart');
                    },
                    gradeFilter: function(){
                        return UserGradeFilter.get();
                    }
                }
            });

            modalInstance.result.then(function(selectedItem) {
                console.log(selectedItem);

                $vm.vmData.UserGroup = angular.copy(selectedItem);

                // 初始化
                _task = [];

                // Delete此Group相關人員
                _task.push({
                    crudType: 'Delete',
                    table: 4,
                    params: {
                        UG_GROUP : $vm.vmData.SG_GCODE
                    }
                });

                // Insert此Group相關人員
                for(var i in selectedItem){
                    _task.push({
                        crudType: 'Insert',
                        table: 4,
                        params: {
                            UG_ID : selectedItem[i].U_ID,
                            UG_GROUP : $vm.vmData.SG_GCODE
                        }
                    });
                }

            }, function() {
                // $log.info('Modal dismissed at: ' + new Date());
            });
        },
        Return : function(){
            ReturnToBillboardEditorPage();
        },
        Update : function(){
            var _tasks = [];

            _tasks.push({
                crudType: 'Update',
                table: 6,
                params: {
                    SG_TITLE       : $vm.vmData.SG_TITLE,
                    SG_DESC        : $vm.vmData.SG_DESC,
                    SG_STS         : $vm.vmData.SG_STS,
                    SG_UP_DATETIME : $filter('date')(new Date, 'yyyy-MM-dd HH:mm:ss')
                },
                condition: {
                    SG_GCODE : $vm.vmData.SG_GCODE
                }
            });

            // 把群組人員塞入
            for(var i in _task){
                _tasks.push(_task[i]);
            }

            RestfulApi.CRUDMSSQLDataByTask(_tasks).then(function (res){
                console.log(res);

                ReturnToBillboardEditorPage();

            }, function (err){
                
            });
        }
	})

    function LoadUserGroup(){
        RestfulApi.SearchMSSQLData({
            querymain: 'group',
            queryname: 'SelectUserGroup',
            params: {
                UG_GROUP : $vm.vmData.SG_GCODE
            }
        }).then(function (res){
            console.log(res["returnData"]);
            $vm.vmData.UserGroup = res["returnData"];
        });
    };

	function ReturnToBillboardEditorPage(){
        $state.transitionTo("app.settings.accountmanagement");
    };

})
.controller('AddGroupPeopleModalInstanceCtrl', function ($uibModalInstance, RestfulApi, vmData, $filter, $timeout, uiGridConstants, depart, gradeFilter) {
    var $ctrl = this;
    $ctrl.vmData = vmData;
    $ctrl.gradeFilter = gradeFilter;
    $ctrl.depart = depart;

    $ctrl.mdData = [];

    $ctrl.MdInit = function(){
        RestfulApi.SearchMSSQLData({
            querymain: 'group',
            queryname: 'SelectAllUserInfoNotWithAdmin'
        }).then(function (res){
            console.log(res["returnData"]);
            // console.log(res);
            // 顯示所有帳號
            $ctrl.mdData = res["returnData"];
            // 把已被選取的帳號打勾
            $timeout(function() {
                if($ctrl.mdDataGridApi.selection.selectRow){
                    // console.log($ctrl.vmData["UserGroup"]);
                    for(var i in $ctrl.vmData["UserGroup"]){
                        $ctrl.mdDataGridApi.selection.selectRow($filter('filter')($ctrl.mdData, {U_ID: $ctrl.vmData["UserGroup"][i].U_ID})[0]);
                    }
                }
            });
        });
    };

    $ctrl.mdDataOptions = {
        data:  '$ctrl.mdData',
        columnDefs: [
            { name: 'U_ID'     ,  displayName: '帳號' },
            { name: 'U_NAME'   ,  displayName: '名稱' },
            { name: 'U_JOB'    ,  displayName: '職稱', cellFilter: 'gradeFilter', filter: 
                {
                    term: null,
                    type: uiGridConstants.filter.SELECT,
                    selectOptions: $ctrl.gradeFilter
                }
            },
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