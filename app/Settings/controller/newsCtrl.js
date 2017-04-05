"use strict";

angular.module('app.settings').controller('NewsCtrl', function ($scope, $stateParams, $state, RestfulApi, Session, toaster, $uibModal, $filter, bool, ioType, FileUploader) {
    console.log($stateParams);

    // $scope.getContent = function() {
    //     console.log('Editor content:', $scope.tinymceModel);
    // };

    // $scope.setContent = function() {
    //     $scope.tinymceModel = 'Time: ' + (new Date());
    // };

    var $vm = this,
        _d = new Date(),
        _filePath = _d.getFullYear() + '/' + ("0" + (_d.getMonth()+1)).slice(-2) + '/' + ("0" + _d.getDate()).slice(-2) + '/';

    // 初始化設定
    if($stateParams.data == null){
        // $vm.POST_FROM = $filter('date')(_d, 'yyyyMMdd');
        // $vm.POST_TOXX = $filter('date')(_d, 'yyyyMMdd');
        $vm.STICK_TOP = "false";
        $vm.IO_TYPE = "All";
        $vm.CONTENT = "";
    }

    angular.extend(this, {
        profile : Session.Get(),
        boolData : bool,
        ioTypeData : ioType,
        uploader : new FileUploader({
            url: '/toolbox/uploadFile?filePath='+_filePath
        }),
        tinymceOptions : {
            skin_url: 'styles/skins/lightgray',
            plugins: 'link image code',
            force_br_newlines : false,
            force_p_newlines : false,
            forced_root_block : '',
            toolbar: '',
            // toolbar: 'undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
            // selector: 'textarea',
            image_advtab: true,
            height: "200px",
            // toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code'
        },
        AddPostGoal : function (){
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'addPostGoalModalContent.html',
                controller: 'AddPostGoalModalInstanceCtrl',
                controllerAs: '$ctrl',
                size: 'lg',
                // appendTo: parentElem,
                resolve: {
                    items: function() {
                        return $vm.profile;
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
        },
        Add : function(){
            console.log($vm);
            RestfulApi.InsertMSSQLData({
                insertname: 'Insert',
                table: 1,
                params: {
                    BB_TITLE : $vm.TITLE,
                    BB_CONTENT : $vm.TITLE,
                    BB_POST_FROM : $vm.POST_FROM,
                    BB_POST_TOXX : $vm.POST_TOXX,
                    BB_IO_TYPE : $vm.IO_TYPE,
                    BB_CR_USER : $vm.profile.U_ID,
                    BB_CR_DATETIME : $filter('date')(_d, 'yyyy-MM-dd HH:mm:ss')
                }
            }).then(function (res) {
                console.log(res["returnData"]);
            }, function (err) {
                console.log(err);
            });
        }
    });

    // Upload Filters
    $vm.uploader.filters.push({
        name: 'queueFilter',
        fn: function(item /*{File|FileLikeObject}*/, options) {
            // return this.queue.length < $scope.optionParam.UploadQueue;
            return this.queue.length < 10;
        }
    });

    $vm.uploader.filters.push({
        name: 'sizeFilter',
        fn: function(item /*{File|FileLikeObject}*/, options) {
            // return item.size < $scope.optionParam.UploadSize * 1000 * 1000;
            return item.size < 10 * 1000 * 1000;
        }
    });

    // $vm.uploader.filters.push({
    //     name: 'fileFilter',
    //     fn: function(item /*{File|FileLikeObject}*/, options) {
    //         var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|',
    //             typeStr = "|";
    //         for(var i in $scope.optionParam.UploadType){
    //             typeStr += $scope.optionParam.UploadType[i] + "|";
    //         }
    //         return typeStr.indexOf(type) !== -1;
    //     }
    // });

    // Upload Callback Methods
    $vm.uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
        console.info('onWhenAddingFileFailed', item, filter, options);
        // var title = "", msg;
        // switch(filter.name){
        //     case "fileFilter":
        //         title = item.name;
        //         msg = "檔案類型錯誤。";
        //         break;
        //     case "sizeFilter":
        //         title = item.name;
        //         msg = "上傳檔案超過" + $scope.optionParam.UploadSize + "Mb。";
        //         break;
        //     case "queueFilter":
        //         msg = "上傳數量超過" + $scope.optionParam.UploadQueue + "個。";
        //         break;
        // }
        // toaster.pop('info', title, msg, 3000);
    };
    $vm.uploader.onAfterAddingFile = function(fileItem) {
        console.info('onAfterAddingFile', fileItem);
        var reader = new FileReader();

        reader.onload = function(readerEvt) {
            var data = readerEvt.target.result;
            var fileNameArray = fileItem.file.name.split(".");
            var queueIndex = $vm.uploader.queue.indexOf(fileItem);
            var rename = angular.copy(CryptoJS.MD5(data).toString() + "." + fileNameArray[fileNameArray.length-1]);
            
            // Duplicate File
            // if($filter('filter')($scope.duplicateFile, rename).length > 0){
            //     $vm.uploader.queue[queueIndex].remove();
            //     toaster.pop('info', '上傳檔案重複', fileItem.file["name"], 3000);
            // }else{
                // $scope.duplicateFile.push(rename);
                // $scope.queueFile.push(rename);
                fileItem.file["rename"] = rename;
                fileItem.url += '&rename='+rename+'&oname='+fileItem.file.name;
            // }
            // var dataFile = forumService.b64toBlob(btoa(data), fileItem.file.type);
            // fileItem.file = dataFile;
        };

        reader.readAsBinaryString(fileItem._file);
    };
    $vm.uploader.onAfterAddingAll = function(addedFileItems) {
        console.info('onAfterAddingAll', addedFileItems);
    };
    $vm.uploader.onBeforeUploadItem = function(item) {
        console.info('onBeforeUploadItem', item);
    };
    $vm.uploader.onProgressItem = function(fileItem, progress) {
        console.info('onProgressItem', fileItem, progress);
    };
    $vm.uploader.onProgressAll = function(progress) {
        console.info('onProgressAll', progress);
    };
    $vm.uploader.onSuccessItem = function(fileItem, response, status, headers) {
        console.info('onSuccessItem', fileItem, response, status, headers);
    };
    $vm.uploader.onErrorItem = function(fileItem, response, status, headers) {
        console.info('onErrorItem', fileItem, response, status, headers);
    };
    $vm.uploader.onCancelItem = function(fileItem, response, status, headers) {
        console.info('onCancelItem', fileItem, response, status, headers);
    };
    $vm.uploader.onCompleteItem = function(fileItem, response, status, headers) {
        console.info('onCompleteItem', fileItem, response, status, headers);
        // if(status == 200){
        //     var _d = new Date();
        //     var insertUploadMessage = {
        //         active: true,
        //         title: "insertUploadMessage",
        //         jspUrl: "jsp/",
        //         handler: "DBInsertReturnID.jsp",
        //         addr: $rootScope._URL,
        //         table: 5,
        //         returnidentity: true,
        //         insertname: 'Insert',
        //         insert: {
        //             C_ID              : $scope.caseChoice,
        //             CJ_UploadDateTime : $filter('date')(_d, 'yyyy/MM/dd HH:mm:ss'),
        //             CJ_OName          : fileItem.file.name,
        //             CJ_RName          : fileItem.file.rename,
        //             CJ_FilePath       : f_filepath,
        //             CJ_TranState      : 0,
        //             CJ_SoftDelete     : 0,
        //             C_CR_USER         : $rootScope.UserInfo.U_ID,
        //             C_CR_DateTime     : $filter('date')(_d, 'yyyy/MM/dd HH:mm:ss')
        //         }
        //     };
        //     var promise = forumService.insertMSSQLData(insertUploadMessage);
        //     promise.then(function(res) {
        //         if(res.trim() != "Fail"){
        //             // console.log("更新成功");
        //             var doexe = {
        //                 active: true,
        //                 title: "DoExe",
        //                 jspUrl: "jsp/",
        //                 handler: "DoExeForCC.jsp",
        //                 filepath: f_filepath,
        //                 filename: fileItem.file.rename,
        //                 fileid: res.trim(),
        //                 filecaseid: $scope.caseChoice
        //             };
        //             var promise = forumService.doCJExe(doexe);
        //             promise.then(function(res) {
        //                 console.log(res.trim())
        //                 if(res.trim() != "Fail"){
                            
        //                 }else{

        //                 }
        //             }, function(data) {
        //                 return 'fail';
        //             });

        //         }else{
        //             // console.log("更新失敗");
        //         }
        //     }, function(data) {
        //         // console.log("更新失敗");
        //     });
        // }else{
        //     toaster.pop('error', "", "檔案上傳失敗", 3000);
        // }
    };
    $vm.uploader.onCompleteAll = function() {
        console.info('onCompleteAll');
    };

    function ReturnToBillboardEditorPage(){
        $state.transitionTo("app.settings.billboardeditor");
    };
})
.controller('AddPostGoalModalInstanceCtrl', function ($uibModalInstance, items) {
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