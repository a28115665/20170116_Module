"use strict";

angular.module('app.selfwork').controller('LeaderJobsCtrl', function ($scope, $stateParams, $state, AuthApi, Session, toaster, $uibModal, $templateCache, uiGridConstants, RestfulApi, compy, opType, userInfoByGrade, $filter, $q) {
    
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

                    AssignOptype();
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
        opType : opType,
        gridMethod : {
            deleteData : function(row){

            },
            // 編輯
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
            // 結單
            closeData : function(row){

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
                            {label:'未派單', value: '0'},
                            {label:'已派單', value: '1'},
                            {label:'已編輯', value: '2'},
                            {label:'已完成', value: '3'},
                        ]
                    }
                },
                // { name: 'W2'          ,  displayName: '報機單負責人', cellFilter: 'userInfoFilter' },
                { name: 'W3_STATUS'   ,  displayName: '銷艙單狀態', cellTemplate: $templateCache.get('accessibilityToForW3'), filter: 
                    {
                        term: null,
                        type: uiGridConstants.filter.SELECT,
                        selectOptions: [
                            {label:'未派單', value: '0'},
                            {label:'已派單', value: '1'},
                            {label:'已編輯', value: '2'},
                            {label:'已完成', value: '3'},
                        ]
                    }
                },
                // { name: 'W3'          ,  displayName: '銷艙單負責人', cellFilter: 'userInfoFilter' },
                { name: 'W1_STATUS'   ,  displayName: '派送單狀態', cellTemplate: $templateCache.get('accessibilityToForW1'), filter: 
                    {
                        term: null,
                        type: uiGridConstants.filter.SELECT,
                        selectOptions: [
                            {label:'未派單', value: '0'},
                            {label:'已派單', value: '1'},
                            {label:'已編輯', value: '2'},
                            {label:'已完成', value: '3'},
                        ]
                    }
                },
                // { name: 'W1'          ,  displayName: '派送單負責人', cellFilter: 'userInfoFilter' },
                { name: 'Options'     ,  displayName: '功能', enableFiltering: false, width: '12%', cellTemplate: $templateCache.get('accessibilityToDMCForLeader') }
            ],
            enableFiltering: true,
            enableSorting: true,
            enableColumnMenus: false,
            // enableVerticalScrollbar: false,
            paginationPageSizes: [10, 25, 50],
            paginationPageSize: 10,
            expandableRowTemplate: 'expandableRowTemplate.html',
            expandableRowHeight: 150,
            enableCellEdit: false,
            onRegisterApi: function(gridApi){
                $vm.orderListGridApi = gridApi;

                gridApi.rowEdit.on.saveRow($scope, $vm.Update);
            }
        },
        ChangeDept : function(){
            AssignOptype();
            LoadOrderList();
            LoadPrincipal();
        },
        CustomizeAssign : function(){
            if($vm.orderListGridApi.selection.getSelectedRows().length > 0){
                var _getSelectedRows = $vm.orderListGridApi.selection.getSelectedRows(),
                    _getDirtyData = [],
                    _getDirty = false;

                for(var i in _getSelectedRows){

                    // 沒有相同負責人才塞入
                    if($filter('filter')(_getSelectedRows[i].subGridOptions.data, { OP_PRINCIPAL : $vm.selectAssignPrincipal }).length == 0){
                        
                        _getSelectedRows[i].subGridOptions.data.push({
                            OP_SEQ : _getSelectedRows[i].OL_SEQ,
                            OP_DEPT : $vm.selectAssignDept,
                            OP_PRINCIPAL : $vm.selectAssignPrincipal,
                            OP_TYPE : $vm.selectAssignOptype
                        });

                        _getDirtyData.push(_getSelectedRows[i]);

                        // 表示需要更新
                        _getDirty = true;
                    }
                }

                if(_getDirty){
                    $vm.orderListGridApi.rowEdit.setRowsDirty(_getDirtyData);
                }else{
                    toaster.pop('info', '訊息', '負責人重複', 3000);
                }
                
                $vm.orderListGridApi.selection.clearSelectedRows();

                // for(var i in _getSelectedRows){
                //     // _getSelectedRows[i][$vm.selectAssignDept] = $vm.selectAssignPrincipal;

                //     var _params = {},
                //         _condition = {};
                //     _params["OL_"+$vm.selectAssignDept+"_PRINCIPAL"] = $vm.selectAssignPrincipal;

                //     // 規則:如果已經被編輯的單就不可以再給別人
                //     _condition["OL_"+$vm.selectAssignDept+"_EDIT_DATETIME"] = null;
                //     _condition["OL_SEQ"] = _getSelectedRows[i].OL_SEQ;
                //     _condition["OL_CR_USER"] = _getSelectedRows[i].OL_CR_USER;

                //     _tasks.push({
                //         crudType: 'Update',
                //         updatename: 'Update',
                //         table: 18,
                //         params: _params,
                //         condition: _condition
                //     });
                // }

                // $vm.Save();
            }
        },
        AutoAssign : function(){
            if($vm.principalData.length > 0){
                console.log($vm.principalData);

                var _getDirtyData = [];

                for(var i in $vm.vmData){

                    // 此負責人編輯狀態為null則刪除
                    var _data = angular.copy($vm.vmData[i].subGridOptions.data);
                    for(var j in _data){
                        if(_data[j].OE_EDATETIME == null){
                            $vm.vmData[i].subGridOptions.data.splice(j, 1);
                            console.log(j, $vm.vmData[i].subGridOptions.data);
                        }
                    }

                    for(var j in $vm.principalData){
                        if($vm.vmData[i].OL_CO_CODE == $vm.principalData[j].COD_CODE){
                            // 有負責人和此data沒有此負責人就塞入資料
                            if(($vm.principalData[j].WHO_PRINCIPAL != null) &&
                                $filter('filter')($vm.vmData[i].subGridOptions.data, { OP_PRINCIPAL : $vm.principalData[j].WHO_PRINCIPAL }).length == 0){
                                // console.log($vm.principalData[j]);
                                $vm.vmData[i].subGridOptions.data.push({
                                    OP_SEQ : $vm.vmData[i].OL_SEQ,
                                    OP_DEPT : $vm.selectAssignDept,
                                    OP_TYPE : $vm.selectAssignOptype,
                                    OP_PRINCIPAL : $vm.principalData[j].WHO_PRINCIPAL
                                });
                            }
                        }
                    }

                    // 自動分派所有單的負責人都會被更新
                    _getDirtyData.push($vm.vmData[i]);

                    // if($filter('filter')($vm.principalData, {
                    //     COD_CODE : $vm.vmData[i].OL_CO_CODE,
                    //     DL_IS_LEAVE : false
                    // }).length != $vm.vmData[i].subGridOptions.data.length){

                    // }
                }

                $vm.orderListGridApi.rowEdit.setRowsDirty(_getDirtyData);
                $vm.orderListGridApi.selection.clearSelectedRows();


                // var _principalData = {};
                // // 找出行家與符合的人
                // for(var i in $vm.principalData){
                //     _principalData[$vm.principalData[i].COD_CODE] = $vm.principalData[i].WHO_PRINCIPAL;
                // }

                // // 每筆資料塞入負責人
                // for(var i in $vm.vmData){
                //     // 是否有符合行家的人
                //     if(!angular.isUndefined(_principalData[$vm.vmData[i].OL_CO_CODE])){
                //         // $vm.vmData[i][$vm.selectAssignDept] = _principalData[$vm.vmData[i].OL_CO_CODE];

                //         var _params = {},
                //             _condition = {};
                //         _params["OL_"+$vm.selectAssignDept+"_PRINCIPAL"] = _principalData[$vm.vmData[i].OL_CO_CODE];

                //         // 規則:如果已經被編輯的單就不可以再給別人
                //         _condition["OL_"+$vm.selectAssignDept+"_EDIT_DATETIME"] = null;
                //         _condition["OL_SEQ"] = $vm.vmData[i].OL_SEQ;
                //         _condition["OL_CR_USER"] = $vm.vmData[i].OL_CR_USER;

                //         _tasks.push({
                //             crudType: 'Update',
                //             updatename: 'Update',
                //             table: 18,
                //             params: _params,
                //             condition: _condition
                //         });
                //     }
                // }

                // $vm.Save();
            }
        },
        CancelPrincipal : function(){
            if($vm.orderListGridApi.selection.getSelectedRows().length > 0){
                var _getSelectedRows = $vm.orderListGridApi.selection.getSelectedRows(),
                    _getDirtyData = [];

                for(var i in _getSelectedRows){
                    if(_getSelectedRows[i].subGridOptions.data.length > 0){
                        _getDirtyData.push(_getSelectedRows[i]);
                    }

                    // 把負責人清空
                    _getSelectedRows[i].subGridOptions.data = [];
                }
                
                if(_getDirtyData.length > 0){
                    $vm.orderListGridApi.rowEdit.setRowsDirty(_getDirtyData);
                }
                $vm.orderListGridApi.selection.clearSelectedRows();

                // for(var i in _getSelectedRows){
                //     _getSelectedRows[i][$vm.selectAssignDept] = null;

                //     var _params = {},
                //         _condition = {};
                //     _params["OL_"+$vm.selectAssignDept+"_PRINCIPAL"] = _getSelectedRows[i][$vm.selectAssignDept];
                    
                //     // 規則:如果已經被編輯的單就不可以再取回
                //     _condition["OL_"+$vm.selectAssignDept+"_EDIT_DATETIME"] = null;
                //     _condition["OL_SEQ"] = _getSelectedRows[i].OL_SEQ;
                //     _condition["OL_CR_USER"] = _getSelectedRows[i].OL_CR_USER;

                //     _tasks.push({
                //         crudType: 'Update',
                //         updatename: 'Update',
                //         table: 18,
                //         params: _params,
                //         condition: _condition
                //     });
                // }

                // $vm.Save();
            }
        },
        // Save : function(){
        //     console.log($vm.vmData);

        //     RestfulApi.CRUDMSSQLDataByTask(_tasks).then(function (res) {
        //         console.log(res["returnData"]);

        //         LoadOrderList();
        //         // toaster.pop('success', '訊息', '派單完成', 3000);
        //     }, function (err) {

        //     }).finally(function() {
        //         _tasks = [];
        //     });
        // },
        Update : function(entity){
            console.log(entity);

            // create a fake promise - normally you'd use the promise returned by $http or $resource
            var promise = $q.defer();
            $vm.orderListGridApi.rowEdit.setSavePromise( entity, promise.promise );
        
            var _tasks = [],
                _d = new Date();

            // Delete此單的負責人
            _tasks.push({
                crudType: 'Delete',
                deletename: 'DeleteOrderPrinplWithEditor',
                table: 21,
                params: {
                    OP_SEQ : entity.OL_SEQ,
                    OP_DEPT : $vm.selectAssignDept
                },

            });

            // Insert此單的負責人
            for(var i in entity.subGridOptions.data){
                // 如果編輯狀態不是空值表示沒有被Delete，所以不重複Insert
                if(entity.subGridOptions.data[i].OE_EDATETIME == null){
                    _tasks.push({
                        crudType: 'Insert',
                        table: 21,
                        params: {
                            OP_SEQ : entity.subGridOptions.data[i].OP_SEQ,
                            OP_DEPT : entity.subGridOptions.data[i].OP_DEPT,
                            OP_TYPE : entity.subGridOptions.data[i].OP_TYPE,
                            OP_PRINCIPAL : entity.subGridOptions.data[i].OP_PRINCIPAL
                        }
                    });
                }
            }

            RestfulApi.CRUDMSSQLDataByTask(_tasks).then(function (res){
                promise.resolve();
            }, function (err) {
                toaster.pop('danger', '錯誤', '更新失敗', 3000);
                promise.reject();
            }).finally(function(){
                if($vm.orderListGridApi.rowEdit.getDirtyRows().length == 0){
                    LoadOrderList();
                }
            });  
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

        RestfulApi.CRUDMSSQLDataByTask([
            {  
                crudType: 'Select',
                querymain: 'leaderJobs',
                queryname: 'SelectOrderList'
            },
            {
                crudType: 'Select',
                querymain: 'leaderJobs',
                queryname: 'SelectOrderPrinpl',
                params: {
                    OP_DEPT : $vm.selectAssignDept
                }
            }
        ]).then(function (res){
            console.log(res["returnData"]);

            for(var i in res["returnData"][0]){

                var _data =[];

                for(var j in res["returnData"][1]){
                    if(res["returnData"][0][i].OL_SEQ == res["returnData"][1][j].OP_SEQ &&
                        $vm.selectAssignOptype == res["returnData"][1][j].OP_TYPE){
                        _data.push(res["returnData"][1][j]);
                    }
                }

                res["returnData"][0][i].subGridOptions = {
                    data: _data,
                    columnDefs: [ 
                        {field: "OP_TYPE", name: "類別", cellFilter: 'opTypeFilter' },
                        {field: "OP_PRINCIPAL", name: "負責人", cellFilter: 'userInfoFilter' },
                        {field: "OE_EDATETIME_STATUS", name: "編輯者", cellTemplate: $templateCache.get('accessibilityToEdited') }
                    ],
                    enableFiltering: false,
                    enableSorting: true,
                    enableColumnMenus: false
                };
                // res["returnData"][0][i]["AGENT_COUNT"] = _data.length;
            }

            $vm.vmData = res["returnData"][0];

        }).finally(function() {
            console.log($vm.vmData);
            SetHeaderClass();
        });

        // RestfulApi.SearchMSSQLData({
        //     querymain: 'leaderJobs',
        //     queryname: 'SelectOrderList'
        // }).then(function (res){
        //     console.log(res["returnData"]);

        //     for(var i in res["returnData"]){
        //         res["returnData"][i]["W2_STATUS"] = ChangeStatus(res["returnData"][i]['W2'], res["returnData"][i]['OL_W2_EDIT_DATETIME'], res["returnData"][i]['OL_W2_OK_DATETIME']);
        //         res["returnData"][i]["W3_STATUS"] = ChangeStatus(res["returnData"][i]['W3'], res["returnData"][i]['OL_W3_EDIT_DATETIME'], res["returnData"][i]['OL_W3_OK_DATETIME']);
        //         res["returnData"][i]["W1_STATUS"] = ChangeStatus(res["returnData"][i]['W1'], res["returnData"][i]['OL_W1_EDIT_DATETIME'], res["returnData"][i]['OL_W1_OK_DATETIME']);
        //     }

        //     $vm.vmData = res["returnData"];
        // });  
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

    function AssignOptype(){
        // 指定何種單類
        switch($vm.selectAssignDept){
            case "W2":
                $vm.selectAssignOptype = "R";
                break;
            case "W3":
                $vm.selectAssignOptype = "W";
                break;
            case "W1":
                $vm.selectAssignOptype = "D";
                break;
        }
    };

    function SetHeaderClass(){
        for(var i in $vm.orderListOptions.columnDefs){
            if($vm.selectAssignDept + "_STATUS" == $vm.orderListOptions.columnDefs[i].name){
                $vm.orderListOptions.columnDefs[i]['headerCellClass'] = 'txt-color-pink';
            }else{
                $vm.orderListOptions.columnDefs[i]['headerCellClass'] = null;
            }
        }
        $vm.orderListGridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
    }

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