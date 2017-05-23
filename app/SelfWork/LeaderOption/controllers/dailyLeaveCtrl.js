"use strict";

angular.module('app.selfwork.leaderoption').controller('DailyLeaveCtrl', function ($scope, $stateParams, $state, AuthApi, Session, toaster, $uibModal, $templateCache, $filter, uiGridConstants, RestfulApi, userInfoByGrade, bool) {
    
    var $vm = this;

	angular.extend(this, {
        Init : function(){
            $vm.selectAssignDept = userInfoByGrade[0][0].value;
            $vm.isLeave = bool[0].value;
            LoadDailyLeave();
        },
        profile : Session.Get(),
        assignGradeData : userInfoByGrade[0],
        boolData : bool,
        dailyLeaveOptions : {
            data:  '$vm.vmData',
            columnDefs: [
                { name: 'U_NAME'     ,  displayName: '人員姓名' },
                { name: 'DL_IS_LEAVE',  displayName: '是否請假', cellFilter: 'booleanFilter', filter: 
                    {
                        term: null,
                        type: uiGridConstants.filter.SELECT,
                        selectOptions: bool
                    }
                }
            ],
            enableFiltering: true,
            enableSorting: false,
            enableColumnMenus: false,
            // enableVerticalScrollbar: false,
            paginationPageSizes: [10, 25, 50],
            paginationPageSize: 10,
            onRegisterApi: function(gridApi){
                $vm.dailyLeaveGridApi = gridApi;
            }
        },
        ChangeLeave : function(){
            if($vm.dailyLeaveGridApi.selection.getSelectedRows().length > 0){
                var _getSelectedRows = $vm.dailyLeaveGridApi.selection.getSelectedRows();
                for(var i in _getSelectedRows){
                    _getSelectedRows[i].DL_IS_LEAVE = $vm.isLeave;
                }
            }
        },
        Save : function(){

            var _tasks = [],
                _d = new Date();

            // Delete此Leader的每日請假
            _tasks.push({
                crudType: 'Delete',
                table: 16,
                params: {
                    DL_DEPT : $vm.selectAssignDept,
                    DL_CR_USER : $vm.profile.U_ID
                }
            });

            // Insert此Leader的每日請假
            for(var i in $vm.vmData){
                console.log($vm.vmData[i]);
                if($vm.vmData[i].DL_IS_LEAVE){
                    _tasks.push({
                        crudType: 'Insert',
                        table: 16,
                        params: {
                            DL_ID : $vm.vmData[i].U_ID,
                            DL_DEPT : $vm.selectAssignDept,
                            DL_CR_USER : $vm.profile.U_ID,
                            DL_CR_DATETIME : $filter('date')(_d, 'yyyy-MM-dd HH:mm:ss')
                        }
                    });
                }
            }

            RestfulApi.CRUDMSSQLDataByTask(_tasks).then(function (res){
                console.log(res["returnData"]);
                toaster.pop('success', '訊息', '請假設定儲存成功', 3000);
            });    
        },
        LoadDailyLeave : function(){
            LoadDailyLeave();
        }
    });

    function LoadDailyLeave(){
        RestfulApi.SearchMSSQLData({
            querymain: 'dailyLeave',
            queryname: 'SelectUserLeavebyGrade',
            params: {
                U_GRADE : $vm.profile.U_GRADE,
                DEPTS : $vm.profile.DEPTS,
                UD_DEPT : $vm.selectAssignDept
            }
        }).then(function (res){
            console.log(res["returnData"]);
            $vm.vmData = res["returnData"];
        });    
    }

})