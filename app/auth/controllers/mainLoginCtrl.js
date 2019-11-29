"use strict";

angular.module('app.auth').controller('MainLoginCtrl', function ($scope, $stateParams, $state, AuthApi, Session, toaster, RestfulApi) {

    var $vm = this;

    $vm.Init = function(){
        RestfulApi.SearchMSSQLData({
            querymain: 'account',
            queryname: 'SelectSysParm'
        }).then(function(res){
            // console.log('sysParm:', res);
            $scope.sysParm = res["returnData"][0];
        });
    }

    // console.log(Session.Get());
    $scope.Login = function($vm){
        // console.log($vm);
        AuthApi.Login({
            U_ID : $vm.userid,
            U_PW : $vm.password
        }).then(function(res) {
            // console.log(res);
            if(res["returnData"] && res["returnData"].length > 0){
                toaster.success("狀態", "登入成功", 3000);

                AuthApi.ReLoadSession().then(function(res){
                    $state.transitionTo("app.default");
                });

            }else{                
                toaster.error("狀態", "帳號密碼錯誤", 3000);
            }
        });
        
    }
})
