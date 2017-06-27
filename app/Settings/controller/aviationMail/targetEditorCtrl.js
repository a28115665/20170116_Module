"use strict";

angular.module('app.settings').controller('TargetEditorCtrl', function ($scope, $stateParams, $state, AuthApi, Session, toaster, $uibModal, $templateCache, RestfulApi, $filter, SUMMERNOT_CONFIG) {
    
    var $vm = this;

	angular.extend(this, {
        Init : function(){
            if($stateParams.data == null){
                $vm.vmData = {
                    "IU" : "Add"
                }
            }else{
                $vm.vmData = $stateParams.data;
                $vm.vmData["IU"] = "Update";

                var _mail = angular.copy($vm.vmData.FM_MAIL.split(";"));
                $vm.vmData.FM_MAIL = [];
                for(var i in _mail){
                    $vm.vmData.FM_MAIL.push({
                        text : _mail[i]
                    });
                }

            }
            console.log($vm.vmData);
        },
        profile : Session.Get(),
        snOptions : SUMMERNOT_CONFIG,
        Return : function(){
            ReturnToAviationMail();
        },
        Add : function(){
            var _mail = angular.copy($vm.vmData.FM_MAIL),
                _mailObjectToArray = [];
            for(var i in _mail){
                _mailObjectToArray.push(_mail[i].text);
            }

            // 檢查信件是否有資料
            if(_mailObjectToArray.length > 0){
                // $vm.vmData.FM_MAIL = _mailObjectToArray.join("; ");

                RestfulApi.InsertMSSQLData({
                    insertname: 'Insert',
                    table: 24,
                    params: {
                        FM_TARGET : $vm.vmData.FM_TARGET,
                        FM_MAIL : _mailObjectToArray.join(";"),
                        FM_TITLE : $vm.vmData.FM_TITLE,
                        FM_CONTENT : $vm.vmData.FM_CONTENT,
                        FM_CR_USER : $vm.profile.U_ID,
                        FM_CR_DATETIME : $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')
                    }
                }).then(function(res) {
                    console.log(res);

                    if(res["returnData"] == 1){
                        ReturnToAviationMail();

                        toaster.pop('success', '訊息', '新增目標成功', 3000);
                    }

                });
            }else{
                toaster.pop('danger', '失敗', '沒有任何信件', 3000);
            }
        },
        Update : function(){
            console.log($vm.vmData);

            var _mail = angular.copy($vm.vmData.FM_MAIL),
                _mailObjectToArray = [];
            for(var i in _mail){
                _mailObjectToArray.push(_mail[i].text);
            }

            // 檢查信件是否有資料
            if(_mailObjectToArray.length > 0){

                RestfulApi.UpdateMSSQLData({
                    updatename: 'Update',
                    table: 24,
                    params: {
                        FM_TARGET : $vm.vmData.FM_TARGET,
                        FM_MAIL : _mailObjectToArray.join(";"),
                        FM_TITLE : $vm.vmData.FM_TITLE,
                        FM_CONTENT : $vm.vmData.FM_CONTENT,
                        FM_UP_USER : $vm.profile.U_ID,
                        FM_UP_DATETIME : $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')
                    },
                    condition: {
                        FM_ID : $vm.vmData.FM_ID
                    }
                }).then(function(res) {
                    console.log(res);

                    if(res["returnData"] == 1){
                        ReturnToAviationMail();

                        toaster.pop('success', '訊息', '更新目標成功', 3000);
                    }

                });
            }else{
                toaster.pop('danger', '失敗', '沒有任何信件', 3000);
            }
        }
    });

    function ReturnToAviationMail(){
        $state.transitionTo($state.current.parent);
    };

})