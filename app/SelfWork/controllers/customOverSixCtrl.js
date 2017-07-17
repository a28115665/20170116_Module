"use strict";

angular.module('app.selfwork').controller('CustomOverSixCtrl', function ($scope, $stateParams, $state, AuthApi, Session, toaster, $uibModal, $templateCache, RestfulApi, $filter, uiGridConstants, overSix, userInfo, $window, ToolboxApi) {
    
    var $vm = this;

	angular.extend(this, {
        Init : function(){
            LoadOverSix();
        },
        profile : Session.Get(),
        gridMethod : {
            // 修改
            modifyData : function(row){
                // console.log(row);

                var modalInstance = $uibModal.open({
                    animation: true,
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    templateUrl: 'modifyOverSixModalContent.html',
                    controller: 'ModifyOverSixModalInstanceCtrl',
                    controllerAs: '$ctrl',
                    // size: 'sm',
                    // appendTo: parentElem,
                    resolve: {
                        items: function(){
                            return row.entity;
                        },
                        overSix: function() {
                            return overSix;
                        }
                    }
                });

                modalInstance.result.then(function(selectedItem) {

                    console.log(selectedItem);

                    RestfulApi.UpdateMSSQLData({
                        updatename: 'Update',
                        table: 27,
                        params: {
                            COS_CONTENT     : selectedItem.COS_CONTENT,
                            COS_UP_USER     : $vm.profile.U_ID,
                            COS_UP_DATETIME : $filter('date')(new Date, 'yyyy-MM-dd HH:mm:ss')
                        },
                        condition: {
                            COS_ID     : selectedItem.COS_ID
                        }
                    }).then(function (res) {

                        LoadOverSix();

                    });

                }, function() {
                    // $log.info('Modal dismissed at: ' + new Date());
                });
                
            }
        },
        overSixOptions : {
            data:  '$vm.overSixData',
            columnDefs: [
                { name: 'Index'       ,  displayName: '序列', width: 50, enableFiltering: false },
                { name: 'COS_TYPE'    ,  displayName: '類型', width: 100, cellFilter: 'overSixFilter', filter: 
                    {
                        term: null,
                        type: uiGridConstants.filter.SELECT,
                        selectOptions: overSix
                    }
                },
                { name: 'COS_CONTENT' ,  displayName: '內容' },
                { name: 'COS_CR_USER' ,  displayName: '建置人員', width: 100, cellFilter: 'userInfoFilter', filter: 
                    {
                        term: null,
                        type: uiGridConstants.filter.SELECT,
                        selectOptions: userInfo
                    }
                },
                { name: 'Options'     ,  displayName: '操作', width: '5%', enableSorting:false, enableFiltering: false, cellTemplate: $templateCache.get('accessibilityToM') }
            ],
            enableFiltering: true,
            enableSorting: true,
            enableColumnMenus: false,
            // enableVerticalScrollbar: false,
            enableRowSelection: true,
            enableSelectAll: true,
            paginationPageSizes: [50, 100, 150, 200, 250, 300],
            paginationPageSize: 100,
            onRegisterApi: function(gridApi){
                $vm.overSixGridApi = gridApi;
            }
        },
        Add : function(){
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'addOverSixModalContent.html',
                controller: 'AddOverSixModalInstanceCtrl',
                controllerAs: '$ctrl',
                // size: 'sm',
                // appendTo: parentElem,
                resolve: {
                    overSix: function() {
                        return overSix;
                    }
                }
            });

            modalInstance.result.then(function(selectedItem) {

                console.log(selectedItem);

                RestfulApi.InsertMSSQLData({
                    insertname: 'Insert',
                    table: 27,
                    params: {
                        COS_TYPE        : selectedItem.COS_TYPE,
                        COS_CONTENT     : selectedItem.COS_CONTENT,
                        COS_CR_USER     : $vm.profile.U_ID,
                        COS_CR_DATETIME : $filter('date')(new Date, 'yyyy-MM-dd HH:mm:ss')
                    }
                }).then(function(res) {

                    LoadOverSix();

                });

            }, function() {
                // $log.info('Modal dismissed at: ' + new Date());
            });
        },
        Delete : function(){
            if($vm.overSixGridApi.selection.getSelectedRows().length > 0){
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
                            return {};
                        },
                        show: function(){
                            return {
                                title : "是否刪除"
                            }
                        }
                    }
                });

                modalInstance.result.then(function(selectedItem) {
                    // $ctrl.selected = selectedItem;
                    var _task = [];

                    for(var i in $vm.overSixGridApi.selection.getSelectedRows()){
                        _task.push({
                            crudType: 'Delete',
                            table: 27,
                            params: {
                                COS_ID : $vm.overSixGridApi.selection.getSelectedRows()[i].COS_ID
                            }
                        });
                    }

                    RestfulApi.CRUDMSSQLDataByTask(_task).then(function (res){

                        if(res["returnData"].length > 0){

                            LoadOverSix();

                        }
                    });

                }, function() {
                    // $log.info('Modal dismissed at: ' + new Date());
                });

            }
        }
    });

    function LoadOverSix(){
        RestfulApi.SearchMSSQLData({
            querymain: 'customOverSix',
            queryname: 'SelectOverSix'
        }).then(function (res){
            console.log(res["returnData"]);
            for(var i=0;i<res["returnData"].length;i++){
                res["returnData"][i]["Index"] = i+1;
            }
            $vm.overSixData = angular.copy(res["returnData"]);
        }); 
    };

})
.controller('AddOverSixModalInstanceCtrl', function ($uibModalInstance, overSix) {
    var $ctrl = this;
    // $ctrl.mdData = angular.copy(items);
    $ctrl.mdData = {};
    $ctrl.overSixData = overSix;

    $ctrl.ok = function() {
        $uibModalInstance.close($ctrl.mdData);
    };

    $ctrl.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
})
.controller('ModifyOverSixModalInstanceCtrl', function ($uibModalInstance, items, overSix) {
    var $ctrl = this;
    $ctrl.mdData = angular.copy(items);
    $ctrl.overSixData = overSix;

    $ctrl.ok = function() {
        $uibModalInstance.close($ctrl.mdData);
    };

    $ctrl.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
});