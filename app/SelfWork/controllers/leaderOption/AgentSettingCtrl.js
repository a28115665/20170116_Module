"use strict";

angular.module('app.selfwork').controller('AgentSettingCtrl', function ($scope, $stateParams, $state, AuthApi, Session, toaster, $uibModal, $templateCache, $filter, uiGridConstants, RestfulApi, userInfoByCompyDistribution, userInfoByCompyDistributionFilter) {
    
    var $vm = this;

	angular.extend(this, {
        Init : function(){
            LoadCompyAgent();
        },
        profile : Session.Get(),
        assignAgentData : userInfoByCompyDistribution,
        agentSettingOptions : {
            data:  '$vm.vmData',
            columnDefs: [
                { name: 'COD_PRINCIPAL',  displayName: '公司負責人', cellFilter: 'userInfoByGradeFilter', filter: 
                    {
                        term: null,
                        type: uiGridConstants.filter.SELECT,
                        selectOptions: userInfoByCompyDistributionFilter
                    }
                },
                { name: 'CO_NAME'      ,  displayName: '公司名稱' },
                { name: 'AS_AGENT'     ,  displayName: '職務代理人', cellFilter: 'userInfoByGradeFilter', filter: 
                    {
                        term: null,
                        type: uiGridConstants.filter.SELECT,
                        selectOptions: userInfoByCompyDistributionFilter
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
        Save : function(){

            var _tasks = [],
                _d = new Date();

            // Delete此Leader管理的行家代理人
            _tasks.push({
                crudType: 'Delete',
                table: 17,
                params: {
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
        }
    });

    function LoadCompyAgent(){
        RestfulApi.SearchMSSQLData({
            querymain: 'agentSetting',
            queryname: 'SelectCompyAgent',
            params: {
                COD_CR_USER : $vm.profile.U_ID
            }
        }).then(function (res){
            console.log(res["returnData"]);
            $vm.vmData = res["returnData"];
        });    
    }

})