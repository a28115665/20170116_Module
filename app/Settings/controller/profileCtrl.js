"use strict";

angular.module('app.settings').controller('ProfileCtrl', function ($scope, $stateParams, $state, AuthApi, Session, toaster, $uibModal) {

    var $vm = this;

    angular.extend(this, {
        profile : Session.Get(),
        Editor : function (pProfile){
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
    });

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
.controller('ModalInstanceCtrl', function ($uibModalInstance, items) {
    var $ctrl = this;
    $ctrl.items = items;
    $ctrl.selected = {
        item: $ctrl.items[0]
    };

    $ctrl.ok = function() {
        $uibModalInstance.close($ctrl.selected.item);
    };

    $ctrl.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
});
