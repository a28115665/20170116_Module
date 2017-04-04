"use strict";

angular.module('app.mainwork').controller('MainWorkCtrl', function ($scope, $stateParams, $state, AuthApi, Session, toaster, $uibModal, $templateCache, billboardData) {
    
    var $vm = this;

    var cellClass = function(grid, row, col, rowRenderIndex, colRenderIndex) {
        if (row.entity.BB_IsTop == 1) {
            return 'bg-color-lighten';
        }
    }

    angular.extend(this, {
        profile : Session.Get(),
        billboardOptions : {
            data:  billboardData,
            columnDefs: [
                { name: 'BB_STICK_TOP',    displayName: '置頂', cellClass: cellClass, cellTemplate: $templateCache.get('accessibilityIsTop'), width: '5%' },
                { name: 'BB_EXPECTED_POST', displayName: '公佈時間', cellClass: cellClass },
                { name: 'BB_TITLE',    displayName: '標題', cellClass: cellClass },
                { name: 'BB_CONTENT',  displayName: '內容', cellClass: cellClass },
                { name: 'BB_CR_Name',  displayName: '公佈人員名稱', cellClass: cellClass }
            ],
            enableFiltering: false,
            enableSorting: false,
            enableColumnMenus: false,
            // enableVerticalScrollbar: false,
            paginationPageSizes: [10, 25, 50],
            paginationPageSize: 10
        },
        gridMethod : {
            //Select
            selectData : function(row){
                console.log(row);
            }
        },
        allOrdersOptions : {
            data:  [
                {
                    a : '2017-02-09',
                    b : '297-64659291',
                    c : '2017-01-15',
                    d : 'CI5822',
                    e : 'HK',
                    f : '新桥供应链',
                    g : true
                },
                {
                    a : '2017-02-09',
                    b : '297-64659292',
                    c : '2017-01-15',
                    d : 'CI5822',
                    e : 'HK',
                    f : '新桥供应链',
                    g : false
                },
            ],
            columnDefs: [
                { name: 'a',        displayName: '提單日期' },
                { name: 'b',        displayName: '主號' },
                { name: 'c',        displayName: '進口日期' },
                { name: 'd',        displayName: '班機' },
                { name: 'e',        displayName: '啟運國別' },
                { name: 'f',        displayName: '寄件人或公司' },
                { name: 'g',        displayName: '是否已領單', visible: false },
                { name: 'options',  displayName: '操作', cellTemplate: $templateCache.get('accessibilityToS') }
            ],
            enableFiltering: false,
            enableSorting: false,
            enableColumnMenus: false,
            // enableVerticalScrollbar: false,
            paginationPageSizes: [10, 25, 50],
            paginationPageSize: 10
        }
    });
    // this.profile = Session.Get();

    $vm.Editor = function (pProfile){
        console.log(pProfile);
        var modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'myModalContent.html',
            controller: 'ModalInstanceCtrl',
            controllerAs: '$ctrl',
            size: 'lg',
            // appendTo: parentElem,
            resolve: {
                items: function() {
                    return pProfile;
                }
            }
        });

        modalInstance.result.then(function(selectedItem) {
            // $ctrl.selected = selectedItem;
        }, function() {
            // $log.info('Modal dismissed at: ' + new Date());
        });

    }

    // $scope.Login = function(mlVM){
    //     console.log(mlVM);
    //     AuthApi.Login({
    //         queryname: 'SelectAllUserInfo',
    //         params: {
    //             U_ID : mlVM.userid,
    //             U_PW : mlVM.password
    //         }
    //     }).then(function(res) {
    //         // console.log(res);
    //         if(res.data["returnData"] && res.data["returnData"].length > 0){
    //             toaster.success("狀態", "登入成功", 3000);
    //             $state.transitionTo("app.dashboard");
    //         }else{                
    //             toaster.error("狀態", "帳號密碼錯誤", 3000);
    //         }
    //     });
    // }
})