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
    $templateCache.put('accessibilityToMC', '<div class="ui-grid-cell-contents text-center">\
                                                    <a href="javascript:void(0);" class="btn btn-warning btn-xs" ng-click="grid.appScope.$vm.gridMethod.modifyData(row)"> 編輯</a>\
                                                    <a href="javascript:void(0);" class="btn btn-danger btn-xs" ng-click="grid.appScope.$vm.gridMethod.cancelData(row)"> 取消</a>\
                                              </div>');

    $templateCache.put('accessibilityToArrivalRemark', '\
                        <div class="ui-grid-cell-contents text-center" ng-switch="row.entity.FA_ARRIVAL_REMK">\
                            <span class="label bg-color-green" ng-switch-when="抵達">{{row.entity.FA_ARRIVAL_REMK}}</span>\
                            <span class="label bg-color-orange" ng-switch-when="時間更改">{{row.entity.FA_ARRIVAL_REMK}}</span>\
                            <span class="label bg-color-blue" ng-switch-when="準時">{{row.entity.FA_ARRIVAL_REMK}}</span>\
                            <span class="label bg-color-red" ng-switch-when="延誤">{{row.entity.FA_ARRIVAL_REMK}}</span>\
                            <span class="label bg-color-blueDark" ng-switch-when="取消">{{row.entity.FA_ARRIVAL_REMK}}</span>\
                            <span class="label bg-color-magenta" ng-switch-when="提早">{{row.entity.FA_ARRIVAL_REMK}}</span>\
                            <span class="label bg-color-redLight" ng-switch-when="加班">{{row.entity.FA_ARRIVAL_REMK}}</span>\
                            <span ng-switch-default>{{row.entity.FA_ARRIVAL_REMK}}</span>\
                      </div>');
    $templateCache.put('accessibilityToMCForPullGoods', '\
                        <div class="ui-grid-cell-contents text-center">\
                            <a href="javascript:void(0);" class="btn btn-warning btn-xs" ng-click="grid.appScope.$vm.gridMethodForPullGoods.modifyData(row)"> 修改</a>\
                            <a href="javascript:void(0);" class="btn btn-danger btn-xs" ng-click="grid.appScope.$vm.gridMethodForPullGoods.cancelData(row)"> 取消</a>\
                      </div>');
    $templateCache.put('accessibilityToMSForAssistantJobs', '\
                        <div class="ui-grid-cell-contents text-center">\
                            <a href="javascript:void(0);" class="btn btn-warning btn-xs" ng-click="grid.appScope.$vm.gridMethod.modifyData(row)"> 修改</a>\
                            <a href="javascript:void(0);" class="btn btn-info btn-xs" ng-click="grid.appScope.$vm.gridMethod.sendMail(row)"> 寄信</a>\
                            <a href="javascript:void(0);" class="btn btn-primary btn-xs" ng-click="grid.appScope.$vm.gridMethod.viewOrder(row)"> 航班</a>\
                      </div>');
    $templateCache.put('accessibilityToMSForAssistantJobsSearch', '\
                        <div class="ui-grid-cell-contents text-center">\
                            <a href="javascript:void(0);" class="btn btn-info btn-xs" ng-click="grid.appScope.$vm.gridMethod.sendMail(row)"> 寄信</a>\
                            <a href="javascript:void(0);" class="btn btn-primary btn-xs" ng-click="grid.appScope.$vm.gridMethod.viewOrder(row)"> 航班</a>\
                      </div>');

	$templateCache.put('accessibilityToRMC', '\
                        <div class="ui-grid-cell-contents text-center">\
            				<a href="javascript:void(0);" class="btn btn-danger btn-xs" ng-click="grid.appScope.$vm.gridMethod.rejectData(row)" ng-disabled="row.entity.g"> 退單</a>\
            				<a href="javascript:void(0);" class="btn btn-warning btn-xs" ng-click="grid.appScope.$vm.gridMethod.modifyData(row)"> 編輯</a>\
            				<a href="javascript:void(0);" class="btn btn-primary btn-xs" ng-click="grid.appScope.$vm.gridMethod.closeData(row)" ng-disabled="row.entity.g"> 完成</a>\
                        </div>');
  $templateCache.put('accessibilityToOperaForJob001', '\
                    <div class="ui-grid-cell-contents text-center">\
                        <a href="javascript:void(0);" class="btn btn-success btn-xs" ng-click="grid.appScope.$vm.gridMethod.gridOperation(row, \'報機單\')"> 工作選項</a>\
                    </div>');
  $templateCache.put('accessibilityToOperaForJob002', '\
                    <div class="ui-grid-cell-contents text-center">\
                        <a href="javascript:void(0);" class="btn btn-success btn-xs" ng-click="grid.appScope.$vm.gridMethod.gridOperation(row, \'銷艙單\')"> 工作選項</a>\
                    </div>');
  $templateCache.put('accessibilityToOperaForJob003', '\
                    <div class="ui-grid-cell-contents text-center">\
                        <a href="javascript:void(0);" class="btn btn-success btn-xs" ng-click="grid.appScope.$vm.gridMethod.gridOperation(row, \'派送單\')"> 工作選項</a>\
                    </div>');
  // $templateCache.put('accessibilityToDMCForJob001', '\
  //                   <div class="ui-grid-cell-contents text-center">\
  //                       <a href="javascript:void(0);" class="btn btn-danger btn-xs" ng-click="grid.appScope.$vm.gridMethodForJob001.rejectData(row)" ng-disabled="row.entity.g"> 退單</a>\
  //                       <a href="javascript:void(0);" class="btn btn-warning btn-xs" ng-click="grid.appScope.$vm.gridMethodForJob001.modifyData(row)"> 編輯</a>\
  //                       <a href="javascript:void(0);" class="btn btn-primary btn-xs" ng-click="grid.appScope.$vm.gridMethodForJob001.closeData(row)" ng-disabled="row.entity.g"> 完成</a>\
  //                       <a href="javascript:void(0);" class="btn btn-danger btn-xs" ng-click="grid.appScope.$vm.gridMethodForJob001.deleteData(row)" ng-disabled="row.entity.g"> 刪除</a>\
  //                   </div>');
  // $templateCache.put('accessibilityToDMCForJob002', '\
  //                   <div class="ui-grid-cell-contents text-center">\
  //                       <a href="javascript:void(0);" class="btn btn-danger btn-xs" ng-click="grid.appScope.$vm.gridMethodForJob002.rejectData(row)" ng-disabled="row.entity.g"> 退單</a>\
  //                       <a href="javascript:void(0);" class="btn btn-warning btn-xs" ng-click="grid.appScope.$vm.gridMethodForJob002.modifyData(row)"> 編輯</a>\
  //                       <a href="javascript:void(0);" class="btn btn-primary btn-xs" ng-click="grid.appScope.$vm.gridMethodForJob002.closeData(row)" ng-disabled="row.entity.g"> 完成</a>\
  //                       <a href="javascript:void(0);" class="btn btn-danger btn-xs" ng-click="grid.appScope.$vm.gridMethodForJob002.deleteData(row)" ng-disabled="row.entity.g"> 刪除</a>\
  //                   </div>');
  // $templateCache.put('accessibilityToDMCForJob003', '\
  //                   <div class="ui-grid-cell-contents text-center">\
  //                       <a href="javascript:void(0);" class="btn btn-danger btn-xs" ng-click="grid.appScope.$vm.gridMethodForJob003.rejectData(row)" ng-disabled="row.entity.g"> 退單</a>\
  //                       <a href="javascript:void(0);" class="btn btn-warning btn-xs" ng-click="grid.appScope.$vm.gridMethodForJob003.modifyData(row)"> 編輯</a>\
  //                       <a href="javascript:void(0);" class="btn btn-primary btn-xs" ng-click="grid.appScope.$vm.gridMethodForJob003.closeData(row)" ng-disabled="row.entity.g"> 完成</a>\
  //                       <a href="javascript:void(0);" class="btn btn-danger btn-xs" ng-click="grid.appScope.$vm.gridMethodForJob003.deleteData(row)" ng-disabled="row.entity.g"> 刪除</a>\
  //                   </div>');
	$templateCache.put('accessibilityToCB', '\
                    <div class="ui-grid-cell-contents text-center">\
                        <a href="javascript:void(0);" class="btn btn-warning btn-xs" ng-click="grid.appScope.$vm.gridMethod.changeNature(row)" ng-hide="row.entity[\'loading\']"> 改單</a>\
                        <a href="javascript:void(0);" class="btn btn-warning btn-xs disabled" ng-show="row.entity[\'loading\']"> <i class="fa fa-refresh fa-spin"></i></a>\
        				<a href="javascript:void(0);" class="btn btn-danger btn-xs" ng-click="grid.appScope.$vm.gridMethod.banData(row)" ng-class="row.entity.BLFO_TRACK != null ? \'disabled\' : \'\'"> 加入黑名單</a>\
                        <a href="javascript:void(0);" class="btn btn-primary btn-xs" ng-click="grid.appScope.$vm.gridMethod.pullGoods(row)" ng-class="row.entity.PG_PULLGOODS ? \'disabled\' : \'\'"> 拉貨</a>\
                        <!--<a href="javascript:void(0);" class="btn btn-primary btn-xs" ng-click="grid.appScope.$vm.gridMethod.cancelPullGoods(row)" ng-show="row.entity.PG_PULLGOODS && !row.entity.PG_MOVED"> 恢復</a>-->\
                        <!--<a href="javascript:void(0);" class="btn btn-success btn-xs" ng-click="grid.appScope.$vm.gridMethod.specialGoods(row)" ng-class="row.entity.SPG_SPECIALGOODS != 0 ? \'disabled\' : \'\'"> 特貨</a>-->\
                        <a href="javascript:void(0);" class="btn btn-default btn-xs" ng-click="grid.appScope.$vm.gridMethod.specialGoods(row)" ng-show="row.entity.SPG_SPECIALGOODS == 0"> 特貨</a>\
                        <a href="javascript:void(0);" class="btn btn-warning btn-xs" ng-click="grid.appScope.$vm.gridMethod.specialGoods(row)" ng-show="row.entity.SPG_SPECIALGOODS == 1"> 普特貨</a>\
                        <a href="javascript:void(0);" class="btn btn-success btn-xs" ng-click="grid.appScope.$vm.gridMethod.specialGoods(row)" ng-show="row.entity.SPG_SPECIALGOODS == 2"> 特特貨</a>\
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
    $templateCache.put('accessibilityToMForCompyInfo', '\
                        <div class="ui-grid-cell-contents text-center">\
                            <a href="javascript:void(0);" class="btn btn-warning btn-xs" ng-click="grid.appScope.$vm.gridCompyInfoMethod.modifyData(row)"> {{$parent.$root.getWord(\'Modify\')}}</a>\
                            <!-- <a href="javascript:void(0);" class="btn btn-danger btn-xs" ng-click="grid.appScope.$vm.gridCompyInfoMethod.deleteData(row)"> {{$parent.$root.getWord(\'Delete\')}}</a> -->\
                        </div>');
    $templateCache.put('accessibilityToMD', '\
                        <div class="ui-grid-cell-contents text-center">\
                            <a href="javascript:void(0);" class="btn btn-warning btn-xs" ng-click="grid.appScope.$vm.gridMethod.modifyData(row)"> {{$parent.$root.getWord(\'Modify\')}}</a>\
                            <a href="javascript:void(0);" class="btn btn-danger btn-xs" ng-click="grid.appScope.$vm.gridMethod.deleteData(row)"> {{$parent.$root.getWord(\'Delete\')}}</a>\
                        </div>');
    $templateCache.put('accessibilityToM', '\
                        <div class="ui-grid-cell-contents text-center">\
                            <a href="javascript:void(0);" class="btn btn-warning btn-xs" ng-click="grid.appScope.$vm.gridMethod.modifyData(row)"> {{$parent.$root.getWord(\'Modify\')}}</a>\
                        </div>');
    $templateCache.put('accessibilityToD', '\
                        <div class="ui-grid-cell-contents text-center">\
                            <a href="javascript:void(0);" class="btn btn-danger btn-xs" ng-click="grid.appScope.$vm.gridMethod.deleteData(row)"> {{$parent.$root.getWord(\'Delete\')}}</a>\
                        </div>');
    $templateCache.put('accessibilityToForW2', '\
                        <div class="ui-grid-cell-contents text-center">\
                            <i class="fa fa-circle-o" data-tooltip-placement="left" data-uib-tooltip="{{row.entity.W2_PRINCIPAL}}" ng-if="row.entity.W2_STATUS == \'1\'"> </i> \
                            <i class="fa fa-circle text-warning" data-tooltip-placement="left" data-uib-tooltip="{{row.entity.W2_PRINCIPAL | userInfoFilter}}" ng-if="row.entity.W2_STATUS == \'2\'"> </i> \
                            <i class="fa fa-circle text-success" data-tooltip-placement="left" data-uib-tooltip="{{row.entity.W2_PRINCIPAL | userInfoFilter}}" ng-if="row.entity.W2_STATUS == \'3\'"> </i> \
                            <i class="fa fa-circle txt-color-magenta" data-tooltip-placement="left" data-uib-tooltip="{{row.entity.W2_PRINCIPAL | userInfoFilter}}" ng-if="row.entity.W2_STATUS == \'4\'"> </i> \
                        </div>');
    $templateCache.put('accessibilityToForW3', '\
                        <div class="ui-grid-cell-contents text-center">\
                            <i class="fa fa-circle-o" data-tooltip-placement="left" data-uib-tooltip="{{row.entity.W3_PRINCIPAL}}" ng-if="row.entity.W3_STATUS == \'1\'"> </i> \
                            <i class="fa fa-circle text-warning" data-tooltip-placement="left" data-uib-tooltip="{{row.entity.W3_PRINCIPAL}}" ng-if="row.entity.W3_STATUS == \'2\'"> </i> \
                            <i class="fa fa-circle text-success" data-tooltip-placement="left" data-uib-tooltip="{{row.entity.W3_PRINCIPAL}}" ng-if="row.entity.W3_STATUS == \'3\'"> </i> \
                            <i class="fa fa-circle txt-color-magenta" data-tooltip-placement="left" data-uib-tooltip="{{row.entity.W3_PRINCIPAL | userInfoFilter}}" ng-if="row.entity.W3_STATUS == \'4\'"> </i> \
                        </div>');
    $templateCache.put('accessibilityToForW1', '\
                        <div class="ui-grid-cell-contents text-center">\
                            <i class="fa fa-circle-o" data-tooltip-placement="left" data-uib-tooltip="{{row.entity.W1_PRINCIPAL}}" ng-if="row.entity.W1_STATUS == \'1\'"> </i> \
                            <i class="fa fa-circle text-warning" data-tooltip-placement="left" data-uib-tooltip="{{row.entity.W1_PRINCIPAL}}" ng-if="row.entity.W1_STATUS == \'2\'"> </i> \
                            <i class="fa fa-circle text-success" data-tooltip-placement="left" data-uib-tooltip="{{row.entity.W1_PRINCIPAL}}" ng-if="row.entity.W1_STATUS == \'3\'"> </i> \
                            <i class="fa fa-circle txt-color-magenta" data-tooltip-placement="left" data-uib-tooltip="{{row.entity.W1_PRINCIPAL | userInfoFilter}}" ng-if="row.entity.W1_STATUS == \'4\'"> </i> \
                        </div>');
    $templateCache.put('accessibilityToDMCForLeader', '\
                        <div class="ui-grid-cell-contents text-center">\
                            <a href="javascript:void(0);" class="btn btn-danger btn-xs" ng-click="grid.appScope.$vm.gridMethod.deleteData(row)" ng-disabled="row.entity.g"> 刪除</a>\
                            <a href="javascript:void(0);" class="btn btn-warning btn-xs" ng-click="grid.appScope.$vm.gridMethod.modifyData(row)"> 修改</a>\
                            <!-- <a href="javascript:void(0);" class="btn btn-primary btn-xs" ng-click="grid.appScope.$vm.gridMethod.closeData(row)" ng-class="(row.entity.W1_STATUS == \'3\' && row.entity.W2_STATUS == \'3\' && row.entity.W3_STATUS == \'3\') ? \'\' : \'disabled\'"> 結單</a> -->\
                            <a href="javascript:void(0);" class="btn btn-primary btn-xs" ng-click="grid.appScope.$vm.gridMethod.closeData(row)" ng-class="(row.entity.W2_STATUS == \'3\' || row.entity.W2_STATUS == \'4\') ? \'\' : \'disabled\'"> 結單</a>\
                        </div>');
    $templateCache.put('accessibilityToMForLeaderSearch', '\
                        <div class="ui-grid-cell-contents text-center">\
                            <a href="javascript:void(0);" class="btn btn-warning btn-xs" ng-click="grid.appScope.$vm.gridMethod.modifyData(row)"> 修改</a>\
                        </div>');
    $templateCache.put('accessibilityToEdited', '\
                        <div class="ui-grid-cell-contents text-center">\
                            <i class="fa fa-check text-primary" ng-if="row.entity.OE_EDATETIME != null"> </i> \
                        </div>');
    $templateCache.put('accessibilityToHistoryCount', '\
                        <div class="ui-grid-cell-contents text-center">\
                            <a href-void="" class="btn btn-danger btn-xs" href="#" ng-class="row.entity.IL_COUNT > 0 ? \'\' : \'disabled\'" ng-click="grid.appScope.$vm.gridMethod.showHistoryCount(row)">{{row.entity.IL_COUNT}}</a> \
                        </div>');

    $templateCache.put('isChecked', '\
                        <div class="modal-header bg-color-blueLight">\
                            <h3 class="modal-title text-center">\
                                <strong class=" txt-color-white">{{$ctrl.data.title}}</strong>\
                            </h3>\
                        </div>\
                        <div class="modal-footer text-center"> \
                            <button class="btn btn-primary" type="button" ng-click="$ctrl.ok()">{{getWord(\'OK\')}}</button> \
                            <button class="btn btn-default" type="button" ng-click="$ctrl.cancel()">{{getWord(\'Cancel\')}}</button> \
                        </div>');

    $templateCache.put('modifyOrderList', '\
                        <div class="modal-header"> \
                            <h3 class="modal-title" id="modal-title">修改</h3> \
                        </div> \
                        <div class="modal-body" id="modal-body"> \
                            <form class="form-horizontal" name="modifyForm"> \
                                <fieldset> \
                                    <div class="form-group"> \
                                        <label class="col-md-2 control-label"><code>*</code>進口日期</label> \
                                        <div class="col-md-10"> \
                                            <input class="form-control" name="OL_IMPORTDT" type="text" ng-model="$ctrl.mdData.OL_IMPORTDT" ui-mask="9999-99-99" ui-mask-placeholder ui-mask-placeholder-char="_" placeholder="請輸入公佈日期 (西元 年-月-日)" model-view-value="true" is-date required/> \
                                        </div> \
                                    </div> \
                                    <div class="form-group"> \
                                        <label class="col-md-2 control-label"><code>*</code>行家</label> \
                                        <div class="col-md-10"> \
                                            <select class="form-control" name="OL_CO_CODE" ng-model="$ctrl.mdData.OL_CO_CODE" ng-options="data.value as data.label for data in $ctrl.compy" ng-disabled="$ctrl.compy.length == 0" required> \
                                            </select> \
                                        </div> \
                                    </div> \
                                    <div class="form-group"> \
                                        <label class="col-md-2 control-label">航班</label> \
                                        <!-- <div class="col-md-10"> \
                                            <input class="form-control" name="OL_FLIGHTNO" placeholder="請輸入航班" ng-model="$ctrl.mdData.OL_FLIGHTNO" type="text" ui-mask="AA 9999" ui-mask-placeholder> \
                                        </div> --> \
                                        <div class="col-md-3" ng-class="$ctrl.mdData.FLIGHTNO_END.length && !$ctrl.mdData.FLIGHTNO_START.length ? \' has-error\' : \'\'"> \
                                            <input class="form-control" ng-model="$ctrl.mdData.FLIGHTNO_START" placeholder="代碼" type="text" ui-mask="AA" ui-mask-placeholder ng-required="$ctrl.mdData.FLIGHTNO_END.length"> \
                                        </div> \
                                        <div class="col-md-7" ng-class="$ctrl.mdData.FLIGHTNO_START.length && !$ctrl.mdData.FLIGHTNO_END.length ? \' has-error\' : \'\'"> \
                                            <input class="form-control" ng-model="$ctrl.mdData.FLIGHTNO_END" placeholder="號碼" type="text" maxlength="4" ng-required="$ctrl.mdData.FLIGHTNO_START.length"> \
                                        </div> \
                                    </div> \
                                    <div class="form-group"> \
                                        <label class="col-md-2 control-label">主號</label> \
                                        <div class="col-md-10"> \
                                            <input class="form-control" name="OL_MASTER" placeholder="請輸入主號" model-view-value="true" ng-model="$ctrl.mdData.OL_MASTER" type="text" ui-mask="999-99999999" ui-mask-placeholder> \
                                        </div> \
                                    </div> \
                                    <div class="form-group"> \
                                        <label class="col-md-2 control-label">起運國別</label> \
                                        <div class="col-md-10"> \
                                            <input class="form-control" name="OL_COUNTRY" placeholder="請輸入起運國別" ng-model="$ctrl.mdData.OL_COUNTRY" type="text" ui-mask="AA" ui-mask-placeholder> \
                                        </div> \
                                    </div> \
                                </fieldset> \
                            </form> \
                        </div> \
                        <div class="modal-footer"> \
                            <button class="btn btn-primary" type="button" ng-click="$ctrl.ok()" ng-disabled="!modifyForm.$valid">{{getWord(\'OK\')}}</button> \
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
.controller('IsCheckedModalInstanceCtrl', function ($uibModalInstance, items, show) {
    var $ctrl = this;

    show['title'] = angular.isUndefined(show['title']) ? "操作提示" : show['title'];

    $ctrl.data = show;
    
    $ctrl.ok = function() {
        $uibModalInstance.close(items);
    };

    $ctrl.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
})
.controller('ModifyOrderListModalInstanceCtrl', function ($uibModalInstance, vmData, compy) {
    var $ctrl = this,
        _flightNo = vmData.OL_FLIGHTNO.split(' ');
    if(_flightNo.length == 2){
        vmData.FLIGHTNO_START = _flightNo[0];
        vmData.FLIGHTNO_END = _flightNo[1];
    }
    $ctrl.mdData = angular.copy(vmData);
    $ctrl.compy = compy;
    
    $ctrl.ok = function() {
        $ctrl.mdData.FLIGHTNO_START = $ctrl.mdData.FLIGHTNO_START.toUpperCase();
        $ctrl.mdData.OL_FLIGHTNO = $ctrl.mdData.FLIGHTNO_START + ' ' + $ctrl.mdData.FLIGHTNO_END;

        $ctrl.mdData.OL_COUNTRY = $ctrl.mdData.OL_COUNTRY.toUpperCase();
        $uibModalInstance.close($ctrl.mdData);
    };

    $ctrl.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
});