"use strict";

angular.module('app.mainwork').controller('MainWorkCtrl', function ($scope, $stateParams, $state, AuthApi, Session, toaster, $uibModal, $templateCache, RestfulApi) {
    
    var $vm = this,
        cellClass = function(grid, row, col, rowRenderIndex, colRenderIndex) {
            if (row.entity.BB_STICK_TOP) {
                return 'bg-color-lighten';
            }
        };

    angular.extend(this, {
        Init : function(){
            LoadBB();
        },
        profile : Session.Get(),
        gridMethod : {
            // 顯示消息
            showNews : function(row){
                console.log(row.entity);
                var modalInstance = $uibModal.open({
                    animation: true,
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    templateUrl: 'news.html',
                    controller: 'NewsModalInstanceCtrl',
                    controllerAs: '$ctrl',
                    size: 'lg',
                    resolve: {
                        vmData: function () {
                            return row.entity;
                        }
                    }
                });

                modalInstance.result.then(function(selectedItem) {
                    
                }, function() {
                    // $log.info('Modal dismissed at: ' + new Date());
                });
            },
            // 一次下載所有檔案
            downloadFiles : function(row){
                console.log(row);
                // 檔案數大於0
                if(row.entity.BBAF_COUNTS > 0){
                    var modalInstance = $uibModal.open({
                        animation: true,
                        ariaLabelledBy: 'modal-title',
                        ariaDescribedBy: 'modal-body',
                        templateUrl: 'downloadFiles.html',
                        controller: 'DownloadFilesModalInstanceCtrl',
                        controllerAs: '$ctrl',
                        // size: 'lg',
                        resolve: {
                            vmData: function () {
                                return row.entity;
                            }
                        }
                    });

                    modalInstance.result.then(function(selectedItem) {
                        console.log(selectedItem);
                        if(selectedItem.length > 0){

                        }
                    }, function() {
                        // $log.info('Modal dismissed at: ' + new Date());
                    });
                }else{
                    toaster.pop('info', '訊息', '無檔案可下載', 3000);
                }
            }
        },
        billboardOptions : {
            data:  '$vm.billboardData',
            columnDefs: [
                { name: 'BB_STICK_TOP', displayName: '置頂', cellClass: cellClass, cellTemplate: $templateCache.get('accessibilityIsTop'), width: '5%' },
                { name: 'BB_POST_FROM', displayName: '開始公佈時間', cellFilter: 'dateFilter', cellClass: cellClass },
                { name: 'BB_POST_TOXX', displayName: '結束公佈時間', cellFilter: 'dateFilter', cellClass: cellClass },
                { name: 'BB_TITLE',     displayName: '標題', cellClass: cellClass, cellTemplate: $templateCache.get('accessibilityTitleURL') },
                { name: 'BB_CONTENT',   displayName: '內容', visible: false, cellClass: cellClass },
                { name: 'BB_CR_USER',   visible: false },
                { name: 'BB_CR_DATETIME',   visible: false },
                { name: 'BBAF_COUNTS',  displayName: '附件', width: '5%', cellClass: cellClass, cellTemplate: $templateCache.get('accessibilityFileCounts') },
                { name: 'U_NAME',       displayName: '公佈人員名稱', visible: false, cellClass: cellClass },
                { name: 'Options'     , displayName: '下載', width: '7%', enableFiltering: false, cellClass: cellClass, cellTemplate: $templateCache.get('accessibilityToOnceDownload') }
            ],
            enableFiltering: false,
            enableSorting: false,
            enableColumnMenus: false,
            // enableVerticalScrollbar: false,
            paginationPageSizes: [10, 25, 50],
            paginationPageSize: 10,
            onRegisterApi: function(gridApi){
                $vm.billboardGridApi = gridApi;
            }
        },
        // gridMethod : {
        //     //Select
        //     selectData : function(row){
        //         console.log(row);
        //     }
        // },
        // allOrdersOptions : {
        //     data:  [
        //         {
        //             a : '2017-02-09',
        //             b : '297-64659291',
        //             c : '2017-01-15',
        //             d : 'CI5822',
        //             e : 'HK',
        //             f : '新桥供应链',
        //             g : true
        //         },
        //         {
        //             a : '2017-02-09',
        //             b : '297-64659292',
        //             c : '2017-01-15',
        //             d : 'CI5822',
        //             e : 'HK',
        //             f : '新桥供应链',
        //             g : false
        //         },
        //     ],
        //     columnDefs: [
        //         { name: 'a',        displayName: '提單日期' },
        //         { name: 'b',        displayName: '主號' },
        //         { name: 'c',        displayName: '進口日期' },
        //         { name: 'd',        displayName: '班機' },
        //         { name: 'e',        displayName: '啟運國別' },
        //         { name: 'f',        displayName: '寄件人或公司' },
        //         { name: 'g',        displayName: '是否已領單', visible: false },
        //         { name: 'options',  displayName: '操作', cellTemplate: $templateCache.get('accessibilityToS') }
        //     ],
        //     enableFiltering: false,
        //     enableSorting: false,
        //     enableColumnMenus: false,
        //     // enableVerticalScrollbar: false,
        //     paginationPageSizes: [10, 25, 50],
        //     paginationPageSize: 10
        // }
    });

    function LoadBB(){
        RestfulApi.SearchMSSQLData({
            querymain: 'main',
            queryname: 'SelectAllBillboard'
        }).then(function (res){
            $vm.billboardData = res["returnData"];
        }).finally(function() {
            HandleWindowResize($vm.billboardGridApi);
        });
    }
})
.controller('NewsModalInstanceCtrl', function ($uibModalInstance, vmData) {
    var $ctrl = this;
    $ctrl.mdData = vmData;

    $ctrl.ok = function() {
        $uibModalInstance.close();
    };

    $ctrl.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
})
.controller('DownloadFilesModalInstanceCtrl', function ($uibModalInstance, vmData, RestfulApi, $templateCache) {
    var $ctrl = this;
    $ctrl.vmData = vmData;
    $ctrl.mdData = [];

    $ctrl.MdInit = function(){
        RestfulApi.SearchMSSQLData({
            querymain: 'main',
            queryname: 'SelectBBAF',
            params: {
                BBAF_CR_USER : $ctrl.vmData.BB_CR_USER,
                BBAF_CR_DATETIME : $ctrl.vmData.BB_CR_DATETIME
            }
        }).then(function (res){
            $ctrl.mdData = res["returnData"];
            console.log($ctrl.mdData);
        })
    };

    $ctrl.mdDataOptions = {
        data:  '$ctrl.mdData',
        columnDefs: [
            { name: 'BBAF_O_FILENAME', displayName: '檔案名稱' },
            { name: 'BBAF_FILESIZE',   displayName: '檔案大小', cellFilter: 'dataMBSize' },
            { name: 'BBAF_FILEPATH', visible: false },
            { name: 'BBAF_R_FILENAME', visible: false }
        ],
        enableFiltering: false,
        enableSorting: false,
        enableColumnMenus: false,
        enableRowSelection: true,
        enableSelectAll: true,
        onRegisterApi: function(gridApi){
            $ctrl.mdDataGridApi = gridApi;
        }
    }

    $ctrl.ok = function() {
        $uibModalInstance.close($ctrl.mdDataGridApi.selection.getSelectedRows());
    };

    $ctrl.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
});