"use strict";

angular.module('app.settings').controller('AviationMailCtrl', function ($scope, $stateParams, $state, AuthApi, Session, toaster, $uibModal, $templateCache, RestfulApi, $filter) {
    
    var $vm = this;

	angular.extend(this, {
        Init : function(){
            LoadFlightMail();
        },
        profile : Session.Get(),
        gridMethod : {
            // 編輯
            modifyData : function(row){
                console.log(row);
                $state.transitionTo("app.selfwork.jobs.editorjob", {
                    data: row.entity
                });
            },
            // 刪除
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
                        table: 24,
                        params: {
                            FM_ID : selectedItem.FM_ID
                        }
                    }).then(function (res) {
                        toaster.pop('success', '訊息', '刪除成功', 3000);
                        LoadFlightMail();
                    });

                }, function() {
                    // $log.info('Modal dismissed at: ' + new Date());
                });
            }
        },
        vmDataOptions : {
            data:  '$vm.vmData',
            columnDefs: [
                { name: 'FM_TARGET', displayName: '目標名稱', width: '100' },
                { name: 'FM_MAIL'  , displayName: '信箱' },
                { name: 'Options'  , displayName: '操作', width: '9%', cellTemplate: $templateCache.get('accessibilityToMD') }
            ],
            enableFiltering: false,
            enableSorting: false,
            enableColumnMenus: false,
            // enableVerticalScrollbar: false,
            paginationPageSizes: [10, 25, 50],
            paginationPageSize: 10
        },
        AddTarget : function(){

            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'addTargetModalContent.html',
                controller: 'AddTargetModalInstanceCtrl',
                controllerAs: '$ctrl',
                size: 'lg'
            });

            modalInstance.result.then(function(selectedItem) {
                console.log(selectedItem);

                var _mail = angular.copy(selectedItem.FM_MAIL),
                    _mailObjectToArray = [];
                for(var i in _mail){
                    _mailObjectToArray.push(_mail[i].text);
                }

                // 檢查信件是否有資料
                if(_mailObjectToArray.length > 0){
                    // selectedItem.FM_MAIL = _mailObjectToArray.join("; ");

                    // RestfulApi.InsertMSSQLData({
                    //     insertname: 'Insert',
                    //     table: 24,
                    //     params: {
                    //         FM_TARGET : selectedItem.FM_TARGET,
                    //         FM_MAIL : _mailObjectToArray.join(";"),
                    //         FM_CONTENT : selectedItem.FM_CONTENT,
                    //         FM_CR_USER : $vm.profile.U_ID,
                    //         FM_CR_DATETIME : $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')
                    //     }
                    // }).then(function(res) {
                    //     console.log(res);

                    //     if(res["returnData"] == 1){
                    //         LoadFlightMail();

                    //         toaster.pop('success', '訊息', '新增信件成功', 3000);
                    //     }

                    // });
                }else{
                    toaster.pop('danger', '失敗', '沒有任何信件', 3000);
                }
            }, function() {
                // $log.info('Modal dismissed at: ' + new Date());
            });
        }
    });

    function LoadFlightMail(){
        RestfulApi.SearchMSSQLData({
            querymain: 'aviationMail',
            queryname: 'SelectFlightMail'
        }).then(function (res){
            console.log(res["returnData"]);
            $vm.vmData = res["returnData"];
        }); 
    };

})
.controller('AddTargetModalInstanceCtrl', function ($uibModalInstance) {
    var $ctrl = this;
    /** 所有類型
        ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'quote'],
        ['bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol', 'redo', 'undo', 'clear'],
        ['justifyLeft', 'justifyCenter', 'justifyRight', 'indent', 'outdent'],
        ['html', 'insertImage','insertLink', 'insertVideo', 'wordcount', 'charcount']
     */
    $ctrl.taToolbar = [
        ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'quote'],
        ['bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol', 'redo', 'undo', 'clear'],
        ['justifyLeft', 'justifyCenter', 'justifyRight', 'indent', 'outdent'],
        ['html', 'wordcount', 'charcount']
    ];
    $ctrl.mdData = {
        FM_CONTENT : ''
    };

    $ctrl.ok = function() {
        $uibModalInstance.close($ctrl.mdData);
    };

    $ctrl.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
});