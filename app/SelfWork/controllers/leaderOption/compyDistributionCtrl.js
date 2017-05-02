"use strict";

angular.module('app.selfwork').controller('CompyDistributionCtrl', function ($scope, $stateParams, $state, AuthApi, Session, toaster, $uibModal, $templateCache, RestfulApi) {
    
    var $vm = this;

	angular.extend(this, {
        Init : function(){
            LoadCompyDistribution();
        },
        profile : Session.Get(),
        gridMethod : {
            //退件
            rejectData : function(row){
                console.log(row);
            },
            //編輯
            modifyData : function(row){
                console.log(row);
                $state.transitionTo("app.selfwork.jobs.editorjob", {
                    data: {
                      id: 5,
                      blue: '#0000FF'
                    }
                });
            },
            //結單
            closeData : function(row){
                console.log(row);
            }
        },
        compyDistributionOptions : {
            data:  '$vm.compyDistributionData',
            columnDefs: [
                { name: 'CO_NUMBER'    ,  displayName: '公司統編' },
                { name: 'CO_NAME'      ,  displayName: '公司名稱' },
                { name: 'CO_ADDR'      ,  displayName: '公司地址' },
                { name: 'COD_PRINCIPAL',  displayName: '負責人' }
            ],
            enableFiltering: true,
            enableSorting: false,
            enableColumnMenus: false,
            // enableVerticalScrollbar: false,
            paginationPageSizes: [10, 25, 50],
            paginationPageSize: 10,
            onRegisterApi: function(gridApi){
                $vm.compyDistributionGridApi = gridApi;
            }
        },
        AssignPrincipal : function(){
            console.log($vm.selectAssignPrincipal);
        }
    });

    function LoadCompyDistribution(){
        // RestfulApi.SearchMSSQLData({
        //     querymain: 'compyDistribution',
        //     queryname: 'SelectCompy'
        // }).then(function (res){
        //     console.log(res["returnData"]);
        //     $vm.compyDistributionData = res["returnData"];
        // });    

        RestfulApi.CRUDMSSQLDataByTask([
            {
                crudType: 'Select',
                querymain: 'compyDistribution',
                queryname: 'SelectCompy'
            },
            {
                crudType: 'Select',
                querymain: 'compyDistribution',
                queryname: 'SelectUserbyGrade',
                params: {
                    U_ID : $vm.profile.U_ID,
                    U_GRADE : $vm.profile.U_GRADE
                }
            }
        ]).then(function (res){
            console.log(res["returnData"]);
            $vm.compyDistributionData = res["returnData"][0];
            $vm.assignPrincipalData = res["returnData"][1];
        });    
    }
})