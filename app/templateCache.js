angular.module('app')
.run(function ($templateCache){
	$templateCache.put('accessibilityIsTop', '<div class="ui-grid-cell-contents text-center">\
                                          			<i class="fa fa-lock" ng-if="row.entity.BB_STICK_TOP"></i>\
                                       		  </div>');
    $templateCache.put('accessibilityTitleURL', '<div class="ui-grid-cell-contents">\
                                                <a href="javascript:void(0);" style="text-decoration:none" ng-click="grid.appScope.$vm.gridMethod.showNews(row)">{{row.entity.BB_TITLE}}</a>\
                                              </div>');
    $templateCache.put('accessibilityFileCounts', '<div class="ui-grid-cell-contents text-center">\
                                                <span class="badge bg-color-orange">{{row.entity.BBAF_COUNTS}}</span>\
                                              </div>');
    $templateCache.put('accessibilityToOnceDownload', '<div class="ui-grid-cell-contents text-center">\
                                                <a href="javascript:void(0);" class="btn btn-default txt-color-pink btn-xs" href="#" ng-click="grid.appScope.$vm.gridMethod.downloadFiles(row)"><i class="fa fa-download fa-lg"></i></a>\
                                            </div>');
    
	$templateCache.put('accessibilityToS', '<div class="ui-grid-cell-contents text-center">\
                                      			<a href="javascript:void(0);" class="btn btn-warning btn-xs" ng-click="grid.appScope.$vm.gridMethod.selectData(row)"> 領單</a>\
                                   		  	</div>');
    $templateCache.put('accessibilityLightStatus', '<div class="ui-grid-cell-contents">\
	                                          			<i class="fa fa-circle text-warning" ng-if="!row.entity.g"> 作業中</i>\
	                                          			<i class="fa fa-circle text-success" ng-if="row.entity.g"> 完成</i>\
	                                       		    </div>');
	$templateCache.put('accessibilityToDMC', '<div class="ui-grid-cell-contents text-center">\
                                    				<a href="javascript:void(0);" class="btn btn-danger btn-xs" ng-click="grid.appScope.$vm.gridMethod.rejectData(row)" ng-disabled="row.entity.g"> 退單</a>\
                                    				<a href="javascript:void(0);" class="btn btn-warning btn-xs" ng-click="grid.appScope.$vm.gridMethod.modifyData(row)"> 編輯</a>\
                                    				<a href="javascript:void(0);" class="btn btn-primary btn-xs" ng-click="grid.appScope.$vm.gridMethod.closeData(row)" ng-disabled="row.entity.g"> 完成</a>\
                               		  		  </div>');
	$templateCache.put('accessibilityToCBA', '<div class="ui-grid-cell-contents text-center">\
                                            <a href="javascript:void(0);" class="btn btn-warning btn-xs" ng-click="grid.appScope.$vm.gridMethod.changeNature(row)"> 改單</a>\
                                    				<a href="javascript:void(0);" class="btn btn-primary btn-xs" ng-click="grid.appScope.$vm.gridMethod.banData(row)"> 加入黑名單</a>\
                                    				<a href="javascript:void(0);" class="btn btn-danger btn-xs" ng-click="grid.appScope.$vm.gridMethod.alertData(row)"> 通報前線</a>\
                               		  		  </div>');
    $templateCache.put('accessibilityToMDForAccount', '<div class="ui-grid-cell-contents text-center">\
                                            <a href="javascript:void(0);" class="btn btn-warning btn-xs" ng-click="grid.appScope.$vm.gridAccountMethod.modifyData(row)"> {{$parent.$root.getWord(\'Modify\')}}</a>\
                                            <a href="javascript:void(0);" class="btn btn-danger btn-xs" ng-click="grid.appScope.$vm.gridAccountMethod.deleteData(row)"> {{$parent.$root.getWord(\'Delete\')}}</a>\
                                          </div>');
    $templateCache.put('accessibilityToMDForGroup', '<div class="ui-grid-cell-contents text-center">\
                                            <a href="javascript:void(0);" class="btn btn-warning btn-xs" ng-click="grid.appScope.$vm.gridGroupMethod.modifyData(row)"> {{$parent.$root.getWord(\'Modify\')}}</a>\
                                            <a href="javascript:void(0);" class="btn btn-danger btn-xs" ng-click="grid.appScope.$vm.gridGroupMethod.deleteData(row)"> {{$parent.$root.getWord(\'Delete\')}}</a>\
                                          </div>');
    $templateCache.put('accessibilityToMDForCustInfo', '<div class="ui-grid-cell-contents text-center">\
                                            <a href="javascript:void(0);" class="btn btn-warning btn-xs" ng-click="grid.appScope.$vm.gridCustInfoMethod.modifyData(row)"> {{$parent.$root.getWord(\'Modify\')}}</a>\
                                            <a href="javascript:void(0);" class="btn btn-danger btn-xs" ng-click="grid.appScope.$vm.gridCustInfoMethod.deleteData(row)"> {{$parent.$root.getWord(\'Delete\')}}</a>\
                                          </div>');
    $templateCache.put('accessibilityToMDForCompyInfo', '<div class="ui-grid-cell-contents text-center">\
                                            <a href="javascript:void(0);" class="btn btn-warning btn-xs" ng-click="grid.appScope.$vm.gridCompyInfoMethod.modifyData(row)"> {{$parent.$root.getWord(\'Modify\')}}</a>\
                                            <a href="javascript:void(0);" class="btn btn-danger btn-xs" ng-click="grid.appScope.$vm.gridCompyInfoMethod.deleteData(row)"> {{$parent.$root.getWord(\'Delete\')}}</a>\
                                          </div>');
    $templateCache.put('accessibilityToM', '<div class="ui-grid-cell-contents text-center">\
                                            <a href="javascript:void(0);" class="btn btn-warning btn-xs" ng-click="grid.appScope.$vm.gridMethod.modifyData(row)"> {{$parent.$root.getWord(\'Modify\')}}</a>\
                                          </div>');
})
.controller('IsDeleteModalInstanceCtrl', function ($uibModalInstance, items) {
    var $ctrl = this;
    
    $ctrl.ok = function() {
        $uibModalInstance.close(items);
    };

    $ctrl.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
});