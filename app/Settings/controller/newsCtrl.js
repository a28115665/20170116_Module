"use strict";

angular.module('app.settings').controller('NewsCtrl', function ($scope, $stateParams, $state, AuthApi, Session, toaster, $uibModal) {
    console.log($stateParams);
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

    $vm.Cancel = function(){
        ReturnToBillboardEditorPage();
    };

    function ReturnToBillboardEditorPage(){
        $state.transitionTo("app.settings.billboardeditor");
    };
})