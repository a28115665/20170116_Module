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
  $templateCache.put('accessibilityToDMCForJob001', '<div class="ui-grid-cell-contents text-center">\
                                            <a href="javascript:void(0);" class="btn btn-danger btn-xs" ng-click="grid.appScope.$vm.gridMethodForJob001.rejectData(row)" ng-disabled="row.entity.g"> 退單</a>\
                                            <a href="javascript:void(0);" class="btn btn-warning btn-xs" ng-click="grid.appScope.$vm.gridMethodForJob001.modifyData(row)"> 編輯</a>\
                                            <a href="javascript:void(0);" class="btn btn-primary btn-xs" ng-click="grid.appScope.$vm.gridMethodForJob001.closeData(row)" ng-disabled="row.entity.g"> 完成</a>\
                                          </div>');
  $templateCache.put('accessibilityToDMCForJob002', '<div class="ui-grid-cell-contents text-center">\
                                            <a href="javascript:void(0);" class="btn btn-danger btn-xs" ng-click="grid.appScope.$vm.gridMethodForJob002.rejectData(row)" ng-disabled="row.entity.g"> 退單</a>\
                                            <a href="javascript:void(0);" class="btn btn-warning btn-xs" ng-click="grid.appScope.$vm.gridMethodForJob002.modifyData(row)"> 編輯</a>\
                                            <a href="javascript:void(0);" class="btn btn-primary btn-xs" ng-click="grid.appScope.$vm.gridMethodForJob002.closeData(row)" ng-disabled="row.entity.g"> 完成</a>\
                                          </div>');
  $templateCache.put('accessibilityToDMCForJob003', '<div class="ui-grid-cell-contents text-center">\
                                            <a href="javascript:void(0);" class="btn btn-danger btn-xs" ng-click="grid.appScope.$vm.gridMethodForJob003.rejectData(row)" ng-disabled="row.entity.g"> 退單</a>\
                                            <a href="javascript:void(0);" class="btn btn-warning btn-xs" ng-click="grid.appScope.$vm.gridMethodForJob003.modifyData(row)"> 編輯</a>\
                                            <a href="javascript:void(0);" class="btn btn-primary btn-xs" ng-click="grid.appScope.$vm.gridMethodForJob003.closeData(row)" ng-disabled="row.entity.g"> 完成</a>\
                                          </div>');
	$templateCache.put('accessibilityToCB', '<div class="ui-grid-cell-contents text-center">\
                                            <a href="javascript:void(0);" class="btn btn-warning btn-xs" ng-click="grid.appScope.$vm.gridMethod.changeNature(row)" ng-hide="row.entity[\'loading\']"> 改單</a>\
                                            <a href="javascript:void(0);" class="btn btn-warning btn-xs disabled" ng-show="row.entity[\'loading\']"> <i class="fa fa-refresh fa-spin"></i></a>\
                                    				<a href="javascript:void(0);" class="btn btn-primary btn-xs" ng-click="grid.appScope.$vm.gridMethod.banData(row)" ng-class="row.entity.BLFO_TRACK != null ? \'disabled\' : \'\'"> 加入黑名單</a>\
                               		  		  </div>');
    $templateCache.put('accessibilityToMForBLFO', '<div class="ui-grid-cell-contents text-center">\
                                            <a href="javascript:void(0);" class="btn btn-warning btn-xs" ng-click="grid.appScope.$vm.gridMethodForBLFO.modifyData(row)"> {{$parent.$root.getWord(\'Modify\')}}</a>\
                                          </div>');
    $templateCache.put('accessibilityToMForBLFL', '<div class="ui-grid-cell-contents text-center">\
                                            <a href="javascript:void(0);" class="btn btn-warning btn-xs" ng-click="grid.appScope.$vm.gridMethodForBLFL.modifyData(row)"> {{$parent.$root.getWord(\'Modify\')}}</a>\
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
    $templateCache.put('accessibilityToForW2', '\
                        <div class="ui-grid-cell-contents text-center">\
                            <i class="fa fa-circle-o" ng-if="row.entity.W2_STATUS == \'0\'"> </i> \
                            <i class="fa fa-circle text-warning" ng-if="row.entity.W2_STATUS == \'1\'"> </i> \
                            <i class="fa fa-circle text-success" ng-if="row.entity.W2_STATUS == \'2\'"> </i> \
                        </div>');
    $templateCache.put('accessibilityToForW3', '\
                        <div class="ui-grid-cell-contents text-center">\
                            <i class="fa fa-circle-o" ng-if="row.entity.W3_STATUS == \'0\'"> </i> \
                            <i class="fa fa-circle text-warning" ng-if="row.entity.W3_STATUS == \'1\'"> </i> \
                            <i class="fa fa-circle text-success" ng-if="row.entity.W3_STATUS == \'2\'"> </i> \
                        </div>');
    $templateCache.put('accessibilityToForW1', '\
                        <div class="ui-grid-cell-contents text-center">\
                            <i class="fa fa-circle-o" ng-if="row.entity.W1_STATUS == \'0\'"> </i> \
                            <i class="fa fa-circle text-warning" ng-if="row.entity.W1_STATUS == \'1\'"> </i> \
                            <i class="fa fa-circle text-success" ng-if="row.entity.W1_STATUS == \'2\'"> </i> \
                        </div>');

    $templateCache.put('isChecked', '\
                        <div class="modal-header bg-color-blueLight">\
                            <h3 class="modal-title text-center">\
                                <strong class=" txt-color-white">操作提示</strong>\
                            </h3>\
                        </div>\
                        <div class="modal-footer text-center"> \
                            <button class="btn btn-primary" type="button" ng-click="$ctrl.ok()">{{getWord(\'OK\')}}</button> \
                            <button class="btn btn-default" type="button" ng-click="$ctrl.cancel()">{{getWord(\'Cancel\')}}</button> \
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
})
.controller('IsCheckedModalInstanceCtrl', function ($uibModalInstance, items) {
    var $ctrl = this;
    
    $ctrl.ok = function() {
        $uibModalInstance.close(items);
    };

    $ctrl.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
});