"use strict";

angular.module('app.selfwork.leaderoption').controller('CompyDistributionCtrl', function ($scope, $stateParams, $state, AuthApi, Session, toaster, $uibModal, $templateCache, $filter, $q, RestfulApi, uiGridConstants, userInfoByGrade, compy) {
    
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
                // { name: 'CO_NUMBER'    ,  displayName: '公司統編' },
                { name: 'CO_CODE'       ,  displayName: '行家', cellFilter: 'compyFilter', filter: 
                    {
                        term: null,
                        type: uiGridConstants.filter.SELECT,
                        selectOptions: compy
                    }
                },
                // { name: 'CO_ADDR'      ,  displayName: '公司地址' },
                // { name: 'COD_PRINCIPAL',  displayName: '負責人' , cellFilter: 'userInfoFilter', filter: 
                //     {
                //         term: null,
                //         type: uiGridConstants.filter.SELECT,
                //         selectOptions: userInfoByGrade[1][userInfoByGrade[0][0].value]
                //     }
                // }
                { name: 'PRINCIPAL_COUNT',  displayName: '負責人數' }
            ],
            enableFiltering: true,
            enableSorting: true,
            enableColumnMenus: false,
            // enableVerticalScrollbar: false,
            paginationPageSizes: [10, 25, 50],
            paginationPageSize: 10,
            expandableRowTemplate: 'expandableRowTemplate.html',
            expandableRowHeight: 150,
            expandableRowScope: {
                $vm : {
                    gridMethod : {
                        deleteData : function(row){
                            console.log(row);

                            var modalInstance = $uibModal.open({
                                animation: true,
                                ariaLabelledBy: 'modal-title',
                                ariaDescribedBy: 'modal-body',
                                template: $templateCache.get('isChecked'),
                                controller: 'IsCheckedModalInstanceCtrl',
                                controllerAs: '$ctrl',
                                size: 'sm',
                                windowClass: 'center-modal',
                                // appendTo: parentElem,
                                resolve: {
                                    items: function() {
                                        return row.entity;
                                    },
                                    show: function(){
                                        return {
                                            title : "是否刪除"
                                        };
                                    }
                                }
                            });

                            modalInstance.result.then(function(selectedItem) {
                                // $ctrl.selected = selectedItem;
                                console.log(selectedItem);

                                RestfulApi.DeleteMSSQLData({
                                    deletename: 'Delete',
                                    table: 15,
                                    params: {
                                        COD_CODE : row.entity.COD_CODE,
                                        COD_DEPT : row.entity.COD_DEPT,
                                        COD_PRINCIPAL : row.entity.COD_PRINCIPAL
                                    }
                                }).then(function (res) {
                                    for(var i in $vm.compyDistributionData){
                                        if($vm.compyDistributionData[i].CO_CODE == row.entity.COD_CODE){
                                            $vm.compyDistributionData[i].PRINCIPAL_COUNT -= 1;

                                            var foundItem = $filter('filter')($vm.compyDistributionData[i].subGridOptions.data, {
                                                COD_CODE : row.entity.COD_CODE,
                                                COD_DEPT : row.entity.COD_DEPT,
                                                COD_PRINCIPAL : row.entity.COD_PRINCIPAL
                                            })[0];

                                            var itemIndex = $vm.compyDistributionData[i].subGridOptions.data.indexOf(foundItem);

                                            $vm.compyDistributionData[i].subGridOptions.data.splice(itemIndex, 1);
                                        }
                                    }

                                });

                            }, function() {
                                // $log.info('Modal dismissed at: ' + new Date());
                            });
                        }
                    }
                }
            },
            enableCellEdit: false,
            onRegisterApi: function(gridApi){
                $vm.compyDistributionGridApi = gridApi;

                gridApi.rowEdit.on.saveRow($scope, $vm.Update);
            }
        },
        AssignPrincipal : function(){
            // console.log($vm.selectAssignPrincipal);
            if($vm.compyDistributionGridApi.selection.getSelectedRows().length > 0){
                var _getSelectedRows = $vm.compyDistributionGridApi.selection.getSelectedRows(),
                    _getDirtyData = [];
                for(var i in _getSelectedRows){

                    var _getDirty = false;

                    // 如果沒有此負責人才塞入
                    if($filter('filter')(_getSelectedRows[i].subGridOptions.data, { COD_PRINCIPAL : $vm.selectAssignPrincipal }).length == 0){
                        _getSelectedRows[i].subGridOptions.data.push({
                            COD_CODE : _getSelectedRows[i].CO_CODE,
                            COD_DEPT : $vm.selectAssignDept,
                            COD_PRINCIPAL : $vm.selectAssignPrincipal
                        });

                        _getSelectedRows[i].PRINCIPAL_COUNT = _getSelectedRows[i].subGridOptions.data.length;
                        _getDirtyData.push(_getSelectedRows[i]);

                        // 表示需要更新
                        _getDirty = true;
                    }

                }

                if(_getDirty){
                    $vm.compyDistributionGridApi.rowEdit.setRowsDirty(_getDirtyData);
                }else{
                    toaster.pop('info', '訊息', '行家負責人被重複指派', 3000);
                }

                $vm.compyDistributionGridApi.selection.clearSelectedRows();
            }
        },
        CancelPrincipal : function(){
            if($vm.compyDistributionGridApi.selection.getSelectedRows().length > 0){
                var _getSelectedRows = $vm.compyDistributionGridApi.selection.getSelectedRows(),
                    _getDirtyData = [];
                for(var i in _getSelectedRows){
                    if(_getSelectedRows[i].subGridOptions.data.length > 0){
                        _getDirtyData.push(_getSelectedRows[i]);
                    }

                    // 把負責人清空
                    _getSelectedRows[i].subGridOptions.data = [];

                    _getSelectedRows[i].PRINCIPAL_COUNT = _getSelectedRows[i].subGridOptions.data.length;

                }

                $vm.compyDistributionGridApi.rowEdit.setRowsDirty(_getDirtyData);
                $vm.compyDistributionGridApi.selection.clearSelectedRows();
            }
        },
        // Save : function(){

        //     var _tasks = [],
        //         _d = new Date();

        //     // Delete此Leader的行家分配
        //     _tasks.push({
        //         crudType: 'Delete',
        //         table: 15,
        //         params: {
        //             COD_DEPT : $vm.selectAssignDept,
        //             // COD_CR_USER : $vm.profile.U_ID
        //         }
        //     });

        //     // Insert此Leader的行家分配
        //     for(var i in $vm.compyDistributionData){
        //         if($vm.compyDistributionData[i].COD_PRINCIPAL != null){
        //             _tasks.push({
        //                 crudType: 'Insert',
        //                 table: 15,
        //                 params: {
        //                     COD_CODE : $vm.compyDistributionData[i].CO_CODE,
        //                     COD_DEPT : $vm.selectAssignDept,
        //                     COD_PRINCIPAL : $vm.compyDistributionData[i].COD_PRINCIPAL,
        //                     COD_CR_USER : $vm.profile.U_ID,
        //                     COD_CR_DATETIME : $filter('date')(_d, 'yyyy-MM-dd HH:mm:ss')
        //                 }
        //             });
        //         }
        //     }

        //     RestfulApi.CRUDMSSQLDataByTask(_tasks).then(function (res){
        //         console.log(res["returnData"]);
        //         toaster.pop('success', '訊息', '行家分配儲存成功', 3000);
        //     });    
        // },
        Update : function(entity){
            // console.log($vm.compyDistributionGridApi.rowEdit);
            // console.log($vm.compyDistributionGridApi.rowEdit.getDirtyRows($vm.compyDistributionGridApi.grid));
            // console.log(entity);

            // create a fake promise - normally you'd use the promise returned by $http or $resource
            var promise = $q.defer();
            $vm.compyDistributionGridApi.rowEdit.setSavePromise( entity, promise.promise );
        
            var _tasks = [],
                _d = new Date();

            // Delete此班的行家
            _tasks.push({
                crudType: 'Delete',
                table: 15,
                params: {
                    COD_CODE : entity.CO_CODE,
                    COD_DEPT : $vm.selectAssignDept
                }
            });

            // Insert此班的行家
            for(var i in entity.subGridOptions.data){
                _tasks.push({
                    crudType: 'Insert',
                    table: 15,
                    params: {
                        COD_CODE : entity.subGridOptions.data[i].COD_CODE,
                        COD_DEPT : $vm.selectAssignDept,
                        COD_PRINCIPAL : entity.subGridOptions.data[i].COD_PRINCIPAL,
                        COD_CR_USER : $vm.profile.U_ID,
                        COD_CR_DATETIME : $filter('date')(_d, 'yyyy-MM-dd HH:mm:ss')
                    }
                });
            }

            RestfulApi.CRUDMSSQLDataByTask(_tasks).then(function (res){
                promise.resolve();
            }, function (err) {
                toaster.pop('danger', '錯誤', '更新失敗', 3000);
                promise.reject();
            });    

            // RestfulApi.UpdateMSSQLData({
            //     insertname: 'Insert',
            //     table: 15,
            //     params: {
            //         COD_CODE      : entity.COD_CODE,
            //         COD_DEPT      : entity.COD_DEPT,
            //         COD_PRINCIPAL : entity.COD_PRINCIPAL,
            //         COD_CR_USER : $vm.profile.U_ID,
            //         COD_CR_DATETIME : $filter('date')(_d, 'yyyy-MM-dd HH:mm:ss')
            //     }
            // }).then(function (res) {
                // promise.resolve();
            // }, function (err) {
            //     toaster.pop('danger', '錯誤', '更新失敗', 3000);
                // promise.reject();
            // });
        },
        LoadCompyDistribution : function(){
            LoadCompyDistribution();   
        }
    });

    function LoadCompyDistribution(){

        RestfulApi.CRUDMSSQLDataByTask([
            {
                crudType: 'Select',
                querymain: 'compyDistribution',
                queryname: 'SelectCompy'
            },
            {  
                crudType: 'Select',
                querymain: 'compyDistribution',
                queryname: 'SelectCompyDistribution',
                params: {
                    COD_DEPT : $vm.selectAssignDept
                }
            }
        ]).then(function (res){
            console.log(res["returnData"]);

            for(var i in res["returnData"][0]){

                var _data =[];

                for(var j in res["returnData"][1]){
                    if(res["returnData"][0][i].CO_CODE == res["returnData"][1][j].COD_CODE){
                        _data.push(res["returnData"][1][j]);
                    }
                }

                res["returnData"][0][i].subGridOptions = {
                    data: _data,
                    columnDefs: [ 
                        {field: "COD_PRINCIPAL", name: "負責人", cellFilter: 'userInfoFilter', filter: 
                            {
                                term: null,
                                type: uiGridConstants.filter.SELECT,
                                selectOptions: userInfoByGrade[1][$vm.selectAssignDept]
                            }
                        },
                        { name: 'Options'     , displayName: '操作', width: '5%', enableFiltering: false, cellTemplate: $templateCache.get('accessibilityToD') }
                    ],
                    enableFiltering: true,
                    enableSorting: true,
                    enableColumnMenus: false
                }
                res["returnData"][0][i]["PRINCIPAL_COUNT"] = _data.length;
            }

            $vm.compyDistributionData = res["returnData"][0];

        }).finally(function() {
            console.log($vm.compyDistributionGridApi);
            // 更新filter selectOptions的值
            // $vm.compyDistributionGridApi.grid.columns[2].filter.selectOptions = userInfoByGrade[1][$vm.selectAssignDept];
        });

        // RestfulApi.SearchMSSQLData({
        //     querymain: 'compyDistribution',
        //     queryname: 'SelectCompyDistribution',
        //     params: {
        //         COD_DEPT : $vm.selectAssignDept
        //     }
        // }).then(function (res){
        //     console.log(res["returnData"]);
        //     $vm.compyDistributionData = res["returnData"];
        // }).finally(function() {
        //     // 更新filter selectOptions的值
        //     $vm.compyDistributionGridApi.grid.columns[2].filter.selectOptions = userInfoByGrade[1][$vm.selectAssignDept];
        //     // console.log($vm.compyDistributionGridApi.grid.columns[4].filter.selectOptions);
        // });    
    }
})