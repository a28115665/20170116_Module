"use strict";

angular.module('app.selfwork').controller('AgentSettingCtrl', function ($scope, $stateParams, $state, AuthApi, Session, toaster, $uibModal, $templateCache, $filter, uiGridConstants, RestfulApi, userInfoByCompyDistribution) {
    
    var $vm = this;

	angular.extend(this, {
        Init : function(){
            $vm.selectAssignDept = userInfoByCompyDistribution[0][0].value;
            LoadCompyAgent();
        },
        profile : Session.Get(),
        assignGradeData : userInfoByCompyDistribution[0],
        assignAgentData : userInfoByCompyDistribution[1],
        agentSettingOptions : {
            data:  '$vm.vmData',
            columnDefs: [
                { name: 'COD_PRINCIPAL',  displayName: '公司負責人', cellFilter: 'userInfoFilter', filter: 
                    {
                        term: null,
                        type: uiGridConstants.filter.SELECT,
                        selectOptions: userInfoByCompyDistribution[1][userInfoByCompyDistribution[0][0].value]
                    }
                },
                { name: 'AS_AGENT'     ,  displayName: '職務代理人', cellFilter: 'userInfoFilter', filter: 
                    {
                        term: null,
                        type: uiGridConstants.filter.SELECT,
                        selectOptions: userInfoByCompyDistribution[1][userInfoByCompyDistribution[0][0].value]
                    }
                },
                { name: 'CO_NAME'      ,  displayName: '公司名稱' }
            ],
            enableFiltering: true,
            enableSorting: false,
            enableColumnMenus: false,
            // enableVerticalScrollbar: false,
            paginationPageSizes: [10, 25, 50],
            paginationPageSize: 10,
            onRegisterApi: function(gridApi){
                $vm.agentSettingGridApi = gridApi;
            }
        },
        AssignAgent : function(){
            if($vm.agentSettingGridApi.selection.getSelectedRows().length > 0){
                var _getSelectedRows = $vm.agentSettingGridApi.selection.getSelectedRows();
                for(var i in _getSelectedRows){
                    // 負責人 不等於 代理人
                    if(_getSelectedRows[i].COD_PRINCIPAL != $vm.selectAssignAgent){
                        _getSelectedRows[i].AS_AGENT = $vm.selectAssignAgent;
                    }
                }
            }
        },
        CancelAgent : function(){
            if($vm.agentSettingGridApi.selection.getSelectedRows().length > 0){
                var _getSelectedRows = $vm.agentSettingGridApi.selection.getSelectedRows();
                for(var i in _getSelectedRows){
                    _getSelectedRows[i].AS_AGENT = null;
                }
            }
        },
        Save : function(){

            var _tasks = [],
                _d = new Date();

            // Delete此Leader管理的行家代理人
            _tasks.push({
                crudType: 'Delete',
                table: 17,
                params: {
                    AS_DEPT : $vm.selectAssignDept,
                    AS_CR_USER : $vm.profile.U_ID
                }
            });

            // Insert此Leader管理的行家代理人
            for(var i in $vm.vmData){
                if($vm.vmData[i].AS_AGENT != null){
                    _tasks.push({
                        crudType: 'Insert',
                        table: 17,
                        params: {
                            AS_CODE : $vm.vmData[i].COD_CODE,
                            AS_DEPT : $vm.selectAssignDept,
                            AS_AGENT : $vm.vmData[i].AS_AGENT,
                            AS_CR_USER : $vm.profile.U_ID,
                            AS_CR_DATETIME : $filter('date')(_d, 'yyyy-MM-dd HH:mm:ss')
                        }
                    });
                }
            }

            RestfulApi.CRUDMSSQLDataByTask(_tasks).then(function (res){
                console.log(res["returnData"]);
                toaster.pop('success', '訊息', '代理人設定儲存成功', 3000);
            });    
        },
        LoadCompyAgent : function(){
            LoadCompyAgent();
        }
    });

    function LoadCompyAgent(){
        RestfulApi.SearchMSSQLData({
            querymain: 'agentSetting',
            queryname: 'SelectCompyAgent',
            params: {
                COD_CR_USER : $vm.profile.U_ID,
                COD_DEPT : $vm.selectAssignDept
            }
        }).then(function (res){
            console.log(res["returnData"]);
            $vm.vmData = res["returnData"];
        }).finally(function() {
            // 更新filter selectOptions的值
            $vm.agentSettingGridApi.grid.columns[1].filter.selectOptions = userInfoByCompyDistribution[1][$vm.selectAssignDept];
            $vm.agentSettingGridApi.grid.columns[3].filter.selectOptions = userInfoByCompyDistribution[1][$vm.selectAssignDept];
        });    
    }

})