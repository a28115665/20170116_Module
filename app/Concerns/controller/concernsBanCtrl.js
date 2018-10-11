"use strict";

angular.module('app.concerns').controller('ConcernsBanCtrl', function ($scope, $stateParams, $state, AuthApi, Session, toaster, $uibModal, $templateCache) {
    
    var $vm = this;

	angular.extend(this, {
        profile : Session.Get(),
        searchCondition : {
        	startDate : new Date(),
        	endDate : new Date(),
        },
        defaultChoice : 'Left',
        gridMethod : {
            //退件
            rejectData : function(row){
                console.log(row);
            },
            //編輯
            modifyData : function(row){
                console.log(row);
                $state.transitionTo("app.selfwork.jobs.editorjob", {
                    data: {
                      id: 5,
                      blue: '#0000FF'
                    }
                });
            },
            //結單
            closeData : function(row){
                console.log(row);
            }
        },
        banOptions : {
            data:  [
                {
                    a : '龍邦',
                    b : '臺灣新北市'
                },
                {
                    a : '龍潭',
                    b : '臺灣桃園'
                }
            ],
            columnDefs: [
                { name: 'a',        displayName: '關注人名' },
                { name: 'b',        displayName: '關注地址' },
                { name: 'options',  displayName: '操作', width: '100', cellTemplate: $templateCache.get('accessibilityToMD') }
            ],
            enableFiltering: false,
            enableSorting: false,
            enableColumnMenus: false,
            // enableVerticalScrollbar: false,
            paginationPageSizes: [10, 25, 50],
            paginationPageSize: 10
        },
        AddBanMember : function() {

            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'addBanMemberModalContent.html',
                controller: 'AddBanMemberModalInstanceCtrl',
                controllerAs: '$ctrl',
                // size: 'lg',
                // appendTo: parentElem,
            });

            modalInstance.result.then(function(selectedItem) {
                console.log(selectedItem);

            }, function() {
                // $log.info('Modal dismissed at: ' + new Date());
            });
        }
    });
})
.controller('AddBanMemberModalInstanceCtrl', function ($uibModalInstance) {
    var $ctrl = this;

    $ctrl.ok = function() {
        $uibModalInstance.close($ctrl.items);
    };

    $ctrl.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
})