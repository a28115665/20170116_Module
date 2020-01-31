"use strict";

angular.module('app.oselfwork').controller('OEmployeeWrongJobsCtrl', function ($scope, $stateParams, $state, AuthApi, Session, toaster, $uibModal, $templateCache, $filter, uiGridConstants, RestfulApi, ocompy, userInfo, $q) {
    
    var $vm = this,
        nextPage = $state.current.name;

	angular.extend(this, {
        Init : function(){
            LoadOrderList();

            if($state.current.name.match(/oemployeewrongjobs/g)){
                nextPage = $state.current.name + '.owjob001';
            }else{
                nextPage = $state.current.name + '.ojob001';
            }
        },
        titleItems : $state.current.name.split(".").slice(1),
        profile : Session.Get(),
        gridMethod : {
            // 各單的工作選項
            gridOperation : function(row, name){
                // 給modal知道目前是哪個欄位操作
                row.entity['name'] = name;

                var modalInstance = $uibModal.open({
                    animation: true,
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    templateUrl: 'oopWorkMenu.html',
                    controller: 'OpWorkMenuModalInstanceCtrl',
                    controllerAs: '$ctrl',
                    scope: $scope,
                    size: 'sm',
                    // windowClass: 'center-modal',
                    // appendTo: parentElem,
                    resolve: {
                        items: function() {
                            return row;
                        }
                    }
                });

                modalInstance.result.then(function(selectedItem) {
                    // $ctrl.selected = selectedItem;
                    console.log(selectedItem);

                }, function() {
                    // $log.info('Modal dismissed at: ' + new Date());
                });
            }
        },
        gridMethodForJob001 : {
            // 修改問題單
            fixData : function(row){
                console.log(row);

                $state.transitionTo(nextPage, {
                    data: row.entity
                });
            }
        },
        orderListOptions : {
            data:  '$vm.selfWorkData',
            columnDefs: [
                { name: 'O_OL_SUPPLEMENT_COUNT'    ,  displayName: '補件', width: 65, pinnedLeft:true, cellTemplate: $templateCache.get('accessibilityToSuppleMent') },
                { name: 'O_OL_IMPORTDT' ,  displayName: '報機日期', width: 91, pinnedLeft:true, cellFilter: 'dateFilter', cellTooltip: cellTooltip },
                { name: 'O_CO_NAME'     ,  displayName: '行家', width: 66, pinnedLeft:true, cellTooltip: cellTooltip },
                { name: 'O_OL_MASTER'   ,  displayName: '主號', width: 133, pinnedLeft:true, cellTooltip: cellTooltip },
                { name: 'O_OL_PASSCODE'          ,  displayName: '通關號碼', width: 91, cellTooltip: cellTooltip },
                { name: 'O_OL_VOYSEQ'            ,  displayName: '航次', width: 66, cellTooltip: cellTooltip },
                { name: 'O_OL_MVNO'              ,  displayName: '呼號', width: 66, cellTooltip: cellTooltip },
                { name: 'O_OL_COMPID'            ,  displayName: '船公司代碼', width: 103, cellTooltip: cellTooltip },
                { name: 'O_OL_ARRLOCATIONID'     ,  displayName: '卸存地點', width: 91, cellTooltip: cellTooltip },
                { name: 'O_OL_POST'              ,  displayName: '裝貨港', width: 78, cellTooltip: cellTooltip },
                { name: 'O_OL_PACKAGELOCATIONID' ,  displayName: '暫存地點', width: 91, cellTooltip: cellTooltip },
                { name: 'O_OL_BOATID'            ,  displayName: '船機代碼', width: 91, cellTooltip: cellTooltip },
                { name: 'O_OL_COUNT'    ,  displayName: '報機單(件數)', width: 80, enableCellEdit: false },
                { name: 'O_OL_PULL_COUNT' ,  displayName: '拉貨(件數)', width: 80, enableCellEdit: false },
                { name: 'O_OL_REASON'   ,  displayName: '描述', width: 100, cellTooltip: cellTooltip },
                { name: 'O_OL_FIX_LOGIC1'   ,  displayName: '重複進口人', width: 100, cellTooltip: cellTooltip },
                { name: 'O_OL_FIX_LOGIC2'   ,  displayName: '重複統編不同人', width: 100, cellTooltip: cellTooltip },
                { name: 'O_OL_FIX_LOGIC3'   ,  displayName: '統編正確性', width: 100, cellTooltip: cellTooltip },
                { name: 'O_OL_FIX_LOGIC4'   ,  displayName: '相同姓名電話但統編不同', width: 100, cellTooltip: cellTooltip },
                { name: 'ITEM_LIST'              ,  displayName: '報機單', enableFiltering: false, width: 86, pinnedRight:true, cellTemplate: $templateCache.get('accessibilityToOperaForJob001') },
                { name: 'UPLOAD_STATUS'          ,  displayName: '上傳狀態', width: 91, pinnedRight:true, cellTemplate: $templateCache.get('accessibilityToForOUploadOnlyAlreadyFixed'), enableFiltering: false }
            ],
            enableFiltering: true,
            enableSorting: true,
            enableColumnMenus: false,
            // enableVerticalScrollbar: false,
            paginationPageSizes: [10, 25, 50, 100],
            paginationPageSize: 100,
            onRegisterApi: function(gridApi){
                $vm.selfWorkGridApi = gridApi;
            }
        }
    });

    function LoadOrderList(){

        RestfulApi.SearchMSSQLData({
            querymain: 'oemployeeJobs',
            queryname: 'SelectOOrderList',
            params: {
                U_ID : $vm.profile.U_ID,
                U_GRADE : $vm.profile.U_GRADE,
                O_OL_ALREADY_FIXED : 0
                // DEPTS : $vm.profile.DEPTS
            }
        }).then(function (res){
            console.log(res["returnData"]);
            $vm.selfWorkData = res["returnData"];
        });    
    };

});