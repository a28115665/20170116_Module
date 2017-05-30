"use strict";

angular.module('app.selfwork').controller('LeaderJobsCtrl', function ($scope, $stateParams, $state, AuthApi, Session, toaster, $uibModal, $templateCache, uiGridConstants, RestfulApi, compy, userInfoByGrade) {
    
    var $vm = this,
        _tasks = [];

	angular.extend(this, {
        Init : function(){
            $scope.ShowTabs = true;
            if(userInfoByGrade[0].length == 0){
                toaster.pop('info', '訊息', '無員工管理', 3000);
                $vm.vmData = [];
                $vm.compyStatisticsData = [];
            }else{
                $vm.LoadData();
            }
        },
        profile : Session.Get(),
        defaultTab : 'hr1',
        TabSwitch : function(pTabID){
            return pTabID == $vm.defaultTab ? 'active' : '';
        },
        LoadData : function(){
            console.log($vm.defaultTab);
            switch($vm.defaultTab){
                case 'hr1':
                    $vm.selectAssignDept = userInfoByGrade[0][0].value;
                    LoadOrderList();
                    LoadPrincipal();
                    break;
                case 'hr2':
                    LoadStatistics();
                    break;
            }
        },
        assignGradeData : userInfoByGrade[0],
        assignPrincipalData : userInfoByGrade[1],
        gridMethod : {
            modifyData : function(row){
                var modalInstance = $uibModal.open({
                    animation: true,
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    template: $templateCache.get('modifyOrderList'),
                    controller: 'ModifyOrderListModalInstanceCtrl',
                    controllerAs: '$ctrl',
                    // size: 'sm',
                    // windowClass: 'center-modal',
                    // appendTo: parentElem,
                    resolve: {
                        vmData: function() {
                            return row.entity;
                        },
                        compy: function() {
                            return compy;
                        }
                    }
                });

                modalInstance.result.then(function(selectedItem) {
                    // $ctrl.selected = selectedItem;
                    console.log(selectedItem);

                    RestfulApi.UpdateMSSQLData({
                        updatename: 'Update',
                        table: 18,
                        params: {
                            OL_IMPORTDT : selectedItem.OL_IMPORTDT,
                            OL_CO_CODE  : selectedItem.OL_CO_CODE,
                            OL_FLIGHTNO : selectedItem.OL_FLIGHTNO,
                            OL_MASTER   : selectedItem.OL_MASTER,
                            OL_COUNTRY  : selectedItem.OL_COUNTRY
                        },
                        condition: {
                            OL_SEQ : selectedItem.OL_SEQ
                        }
                    }).then(function (res) {
                        LoadOrderList();
                    });

                }, function() {
                    // $log.info('Modal dismissed at: ' + new Date());
                });
            },
            deleteData : function(row){

            }
        },
        orderListOptions : {
            data:  '$vm.vmData',
            columnDefs: [
                { name: 'OL_IMPORTDT' ,  displayName: '進口日期', cellFilter: 'dateFilter' },
                { name: 'OL_CO_CODE'  ,  displayName: '行家', cellFilter: 'compyFilter', filter: 
                    {
                        term: null,
                        type: uiGridConstants.filter.SELECT,
                        selectOptions: compy
                    }
                },
                { name: 'OL_FLIGHTNO' ,  displayName: '航班' },
                { name: 'OL_MASTER'   ,  displayName: '主號' },
                { name: 'OL_COUNTRY'  ,  displayName: '起運國別' },
                { name: 'W2_STATUS'   ,  displayName: '報機單狀態', cellTemplate: $templateCache.get('accessibilityToForW2'), filter: 
                    {
                        term: null,
                        type: uiGridConstants.filter.SELECT,
                        selectOptions: [
                            {label:'已派單', value: '0'},
                            {label:'已編輯', value: '1'},
                            {label:'已完成', value: '2'},
                        ]
                    }
                },
                { name: 'W2'          ,  displayName: '報機單負責人', cellFilter: 'userInfoFilter' },
                { name: 'W3_STATUS'   ,  displayName: '銷艙單狀態', cellTemplate: $templateCache.get('accessibilityToForW3'), filter: 
                    {
                        term: null,
                        type: uiGridConstants.filter.SELECT,
                        selectOptions: [
                            {label:'已派單', value: '0'},
                            {label:'已編輯', value: '1'},
                            {label:'已完成', value: '2'},
                        ]
                    }
                },
                { name: 'W3'          ,  displayName: '銷艙單負責人', cellFilter: 'userInfoFilter' },
                { name: 'W1_STATUS'   ,  displayName: '派送單狀態', cellTemplate: $templateCache.get('accessibilityToForW1'), filter: 
                    {
                        term: null,
                        type: uiGridConstants.filter.SELECT,
                        selectOptions: [
                            {label:'已派單', value: '0'},
                            {label:'已編輯', value: '1'},
                            {label:'已完成', value: '2'},
                        ]
                    }
                },
                { name: 'W1'          ,  displayName: '派送單負責人', cellFilter: 'userInfoFilter' },
                { name: 'Options'     ,  displayName: '功能', enableFiltering: false, width: '9%', cellTemplate: $templateCache.get('accessibilityToMD') }
            ],
            enableFiltering: true,
            enableSorting: true,
            enableColumnMenus: false,
            // enableVerticalScrollbar: false,
            paginationPageSizes: [10, 25, 50],
            paginationPageSize: 10,
            onRegisterApi: function(gridApi){
                $vm.orderListGridApi = gridApi;
            }
        },
        CustomizeAssign : function(){
            if($vm.orderListGridApi.selection.getSelectedRows().length > 0){
                var _getSelectedRows = $vm.orderListGridApi.selection.getSelectedRows();
                for(var i in _getSelectedRows){
                    // _getSelectedRows[i][$vm.selectAssignDept] = $vm.selectAssignPrincipal;

                    var _params = {},
                        _condition = {};
                    _params["OL_"+$vm.selectAssignDept+"_PRINCIPAL"] = $vm.selectAssignPrincipal;

                    // 規則:如果已經被編輯的單就不可以再給別人
                    _condition["OL_"+$vm.selectAssignDept+"_EDIT_DATETIME"] = null;
                    _condition["OL_SEQ"] = _getSelectedRows[i].OL_SEQ;
                    _condition["OL_CR_USER"] = _getSelectedRows[i].OL_CR_USER;

                    _tasks.push({
                        crudType: 'Update',
                        updatename: 'Update',
                        table: 18,
                        params: _params,
                        condition: _condition
                    });
                }

                $vm.Save();
            }
        },
        AutoAssign : function(){
            if($vm.principalData.length > 0){
                var _principalData = {};
                // 找出行家與符合的人
                for(var i in $vm.principalData){
                    _principalData[$vm.principalData[i].COD_CODE] = $vm.principalData[i].WHO_PRINCIPAL;
                }

                // 每筆資料塞入負責人
                for(var i in $vm.vmData){
                    // 是否有符合行家的人
                    if(!angular.isUndefined(_principalData[$vm.vmData[i].OL_CO_CODE])){
                        // $vm.vmData[i][$vm.selectAssignDept] = _principalData[$vm.vmData[i].OL_CO_CODE];

                        var _params = {},
                            _condition = {};
                        _params["OL_"+$vm.selectAssignDept+"_PRINCIPAL"] = _principalData[$vm.vmData[i].OL_CO_CODE];

                        // 規則:如果已經被編輯的單就不可以再給別人
                        _condition["OL_"+$vm.selectAssignDept+"_EDIT_DATETIME"] = null;
                        _condition["OL_SEQ"] = $vm.vmData[i].OL_SEQ;
                        _condition["OL_CR_USER"] = $vm.vmData[i].OL_CR_USER;

                        _tasks.push({
                            crudType: 'Update',
                            updatename: 'Update',
                            table: 18,
                            params: _params,
                            condition: _condition
                        });
                    }
                }

                $vm.Save();
            }
        },
        CancelPrincipal : function(){
            if($vm.orderListGridApi.selection.getSelectedRows().length > 0){
                var _getSelectedRows = $vm.orderListGridApi.selection.getSelectedRows();
                for(var i in _getSelectedRows){
                    _getSelectedRows[i][$vm.selectAssignDept] = null;

                    var _params = {},
                        _condition = {};
                    _params["OL_"+$vm.selectAssignDept+"_PRINCIPAL"] = _getSelectedRows[i][$vm.selectAssignDept];
                    
                    // 規則:如果已經被編輯的單就不可以再取回
                    _condition["OL_"+$vm.selectAssignDept+"_EDIT_DATETIME"] = null;
                    _condition["OL_SEQ"] = _getSelectedRows[i].OL_SEQ;
                    _condition["OL_CR_USER"] = _getSelectedRows[i].OL_CR_USER;

                    _tasks.push({
                        crudType: 'Update',
                        updatename: 'Update',
                        table: 18,
                        params: _params,
                        condition: _condition
                    });
                }

                $vm.Save();
            }
        },
        Save : function(){
            console.log($vm.vmData);

            RestfulApi.CRUDMSSQLDataByTask(_tasks).then(function (res) {
                console.log(res["returnData"]);

                LoadOrderList();
                // toaster.pop('success', '訊息', '派單完成', 3000);
            }, function (err) {

            }).finally(function() {
                _tasks = [];
            });
        },
        LoadPrincipal : function(){
            LoadPrincipal()
        },
        compyStatisticsOptions : {
            data:  '$vm.compyStatisticsData',
            columnDefs: [
                { name: 'CO_NAME'  ,  displayName: '行家' },
                { name: 'W2_COUNT' ,  displayName: '報機單', enableFiltering: false },
                { name: 'W3_COUNT' ,  displayName: '銷艙單', enableFiltering: false },
                { name: 'W1_COUNT' ,  displayName: '派件單', enableFiltering: false }
            ],
            enableFiltering: true,
            enableSorting: true,
            enableColumnMenus: false,
            // enableVerticalScrollbar: false,
            paginationPageSizes: [10, 25, 50],
            paginationPageSize: 10,
            onRegisterApi: function(gridApi){
                $vm.compyStatisticsGridApi = gridApi;
            }
        },
        ExportExcel : function(){
            
        }
    });

    function LoadOrderList(){
        RestfulApi.SearchMSSQLData({
            querymain: 'leaderJobs',
            queryname: 'SelectOrderList'
        }).then(function (res){
            console.log(res["returnData"]);

            for(var i in res["returnData"]){
                res["returnData"][i]["W2_STATUS"] = ChangeStatus(res["returnData"][i]['W2'], res["returnData"][i]['OL_W2_EDIT_DATETIME'], res["returnData"][i]['OL_W2_OK_DATETIME']);
                res["returnData"][i]["W3_STATUS"] = ChangeStatus(res["returnData"][i]['W3'], res["returnData"][i]['OL_W3_EDIT_DATETIME'], res["returnData"][i]['OL_W3_OK_DATETIME']);
                res["returnData"][i]["W1_STATUS"] = ChangeStatus(res["returnData"][i]['W1'], res["returnData"][i]['OL_W1_EDIT_DATETIME'], res["returnData"][i]['OL_W1_OK_DATETIME']);
            }

            $vm.vmData = res["returnData"];
        });  
    };

    /**
     * [ChangeStatus description] 各單負責人狀態
     * @param {[type]} pPrincipal    [description]
     * @param {[type]} pEditDatetime [description]
     * @param {[type]} pOkDatetime   [description]
     */
    function ChangeStatus(pPrincipal, pEditDatetime, pOkDatetime){
        var _value = null;

        if(pPrincipal != null && pEditDatetime == null && pOkDatetime == null){
            _value = "0";
        }
        else if(pPrincipal != null && pEditDatetime != null && pOkDatetime == null){
            _value = "1";
        }
        else if(pPrincipal != null && pEditDatetime != null && pOkDatetime != null){
            _value = "2";
        }

        return _value;
    };

    function LoadPrincipal(){
        RestfulApi.SearchMSSQLData({
            querymain: 'leaderJobs',
            queryname: 'WhoPrincipal',
            params: {
                AS_DEPT : $vm.selectAssignDept
            }
        }).then(function (res){
            console.log(res["returnData"]);
            $vm.principalData = res["returnData"];
        });  
    };

    function LoadStatistics(){
        RestfulApi.SearchMSSQLData({
            querymain: 'leaderJobs',
            queryname: 'SelectCompyStatistics'
        }).then(function (res){
            console.log(res["returnData"]);
            $vm.compyStatisticsData = res["returnData"];
        });  
    };

})