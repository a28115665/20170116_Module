"use strict";

angular.module('app.settings').controller('NewsCtrl', function ($scope, $stateParams, $state, AuthApi, Session, toaster, $uibModal, $filter, bool, ioType) {
    console.log($stateParams);

    // $scope.getContent = function() {
    //     console.log('Editor content:', $scope.tinymceModel);
    // };

    // $scope.setContent = function() {
    //     $scope.tinymceModel = 'Time: ' + (new Date());
    // };

    var $vm = this,
        _d = new Date();

    // 初始化設定
    if($stateParams.data == null){
        $vm.EXPECTED_POST = $filter('date')(_d, 'yyyyMMdd');
        $vm.STICK_TOP = "false";
        $vm.IO_TYPE = "All";
        $vm.CONTENT = "";
    }

    angular.extend(this, {
        profile : Session.Get(),
        boolData : bool,
        ioTypeData : ioType,
        tinymceOptions : {
            skin_url: 'styles/skins/lightgray',
            plugins: 'link image code',
            force_br_newlines : false,
            force_p_newlines : false,
            forced_root_block : '',
            // toolbar1: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image",
            // toolbar2: "print preview media | forecolor backcolor emoticons",
            image_advtab: true,
            height: "200px",
            // toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code'
        },
        AddPostGoal : function (){
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

        },
        Return : function(){
            ReturnToBillboardEditorPage();
        }
    });

    function ReturnToBillboardEditorPage(){
        $state.transitionTo("app.settings.billboardeditor");
    };
})