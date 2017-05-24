"use strict";

angular.module('app.selfwork.leaderoption').controller('CompyDistributionCtrl', function ($scope, $stateParams, $state, AuthApi, Session, toaster, $uibModal, $templateCache, $filter, RestfulApi, uiGridConstants, userInfoByGrade) {
    
    var $vm = this;

	angular.extend(this, {
        Init : function(){
            $vm.selectAssignDept = userInfoByGrade[0][0].value;
            LoadCompyDistribution();
        },
        profile : Session.Get(),
        assignGradeData : userInfoByGrade[0],
        assignPrincipalData : userInfoByGrade[1],
        compyDistributionOptions : {
            data:  '$vm.compyDistributionData',
            columnDefs: [
                { name: 'CO_NUMBER'    ,  displayName: '公司統編' },
                { name: 'CO_NAME'      ,  displayName: '公司名稱' },
                { name: 'CO_ADDR'      ,  displayName: '公司地址' },
                { name: 'COD_PRINCIPAL',  displayName: '負責人' , cellFilter: 'userInfoFilter', filter: 
                    {
                        term: null,
                        type: uiGridConstants.filter.SELECT,
                        selectOptions: userInfoByGrade[1][userInfoByGrade[0][0].value]
                    }
                }
            ],
            enableFiltering: true,
            enableSorting: true,
            enableColumnMenus: false,
            // enableVerticalScrollbar: false,
            paginationPageSizes: [10, 25, 50],
            paginationPageSize: 10,
            onRegisterApi: function(gridApi){
                $vm.compyDistributionGridApi = gridApi;
            }
        },
        AssignPrincipal : function(){
            // console.log($vm.selectAssignPrincipal);
            if($vm.compyDistributionGridApi.selection.getSelectedRows().length > 0){
                var _getSelectedRows = $vm.compyDistributionGridApi.selection.getSelectedRows();
                for(var i in _getSelectedRows){
                    _getSelectedRows[i].COD_DEPT = $vm.selectAssignDept;
                    _getSelectedRows[i].COD_PRINCIPAL = $vm.selectAssignPrincipal;
                }

                $vm.compyDistributionGridApi.selection.clearSelectedRows();
            }
        },
        CancelPrincipal : function(){
            if($vm.compyDistributionGridApi.selection.getSelectedRows().length > 0){
                var _getSelectedRows = $vm.compyDistributionGridApi.selection.getSelectedRows();
                for(var i in _getSelectedRows){
                    _getSelectedRows[i].COD_DEPT = null;
                    _getSelectedRows[i].COD_PRINCIPAL = null;
                }

                $vm.compyDistributionGridApi.selection.clearSelectedRows();
            }
        },
        Save : function(){

            var _tasks = [],
                _d = new Date();

            // Delete此Leader的行家分配
            _tasks.push({
                crudType: 'Delete',
                table: 15,
                params: {
                    COD_DEPT : $vm.selectAssignDept,
                    COD_CR_USER : $vm.profile.U_ID
                }
            });

            // Insert此Leader的行家分配
            for(var i in $vm.compyDistributionData){
                if($vm.compyDistributionData[i].COD_PRINCIPAL != null){
                    _tasks.push({
                        crudType: 'Insert',
                        table: 15,
                        params: {
                            COD_CODE : $vm.compyDistributionData[i].CO_CODE,
                            COD_DEPT : $vm.selectAssignDept,
                            COD_PRINCIPAL : $vm.compyDistributionData[i].COD_PRINCIPAL,
                            COD_CR_USER : $vm.profile.U_ID,
                            COD_CR_DATETIME : $filter('date')(_d, 'yyyy-MM-dd HH:mm:ss')
                        }
                    });
                }
            }

            RestfulApi.CRUDMSSQLDataByTask(_tasks).then(function (res){
                console.log(res["returnData"]);
                toaster.pop('success', '訊息', '行家分配儲存成功', 3000);
            });    
        },
        LoadCompyDistribution : function(){
            LoadCompyDistribution();   
        }
    });

    function LoadCompyDistribution(){
        RestfulApi.SearchMSSQLData({
            querymain: 'compyDistribution',
            queryname: 'SelectCompy',
            params: {
                COD_DEPT : $vm.selectAssignDept
            }
        }).then(function (res){
            console.log(res["returnData"]);
            $vm.compyDistributionData = res["returnData"];
        }).finally(function() {
            // 更新filter selectOptions的值
            $vm.compyDistributionGridApi.grid.columns[4].filter.selectOptions = userInfoByGrade[1][$vm.selectAssignDept];
            // console.log($vm.compyDistributionGridApi.grid.columns[4].filter.selectOptions);
        });    
    }
})