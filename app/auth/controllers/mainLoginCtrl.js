"use strict";

angular.module('app.auth').controller('MainLoginCtrl', function ($scope, $stateParams, $state, AuthApi, Session, toaster) {

    $scope.Login = function(mlVM){
        console.log(mlVM);
        AuthApi.Login({
            queryname: 'SelectAllUserInfo',
            params: {
                U_ID : mlVM.userid,
                U_PW : mlVM.password
            }
        }).then(function(res) {
            // console.log(res);
            if(res["returnData"] && res["returnData"].length > 0){
                toaster.success("狀態", "登入成功", 3000);
                $state.transitionTo("app.dashboard");
            }else{                
                toaster.error("狀態", "帳號密碼錯誤", 3000);
            }
        });
    }
})
