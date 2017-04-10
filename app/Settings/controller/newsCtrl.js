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
        _filepath = _d.getFullYear() + '/' + ("0" + (_d.getMonth()+1)).slice(-2) + '/' + ("0" + _d.getDate()).slice(-2) + '/';

    angular.extend(this, {
        Init : function(){
            // 不正常登入此頁面
            // if($stateParams.data == null) ReturnToBillboardEditorPage();
            if($stateParams.data == null){
                $vm.vmData = {
                    STICK_TOP : false,
                    IO_TYPE : "All",
                    CONTENT : ""
                }
            }
        },
        profile : Session.Get(),
        boolData : bool,
        ioTypeData : ioType,
        uploader : new FileUploader({
            url: '/toolbox/uploadFile?filePath='+_filepath
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
                    vmData: function(){
                        return $vm.vmData;
                    }
                }
            });

            modalInstance.result.then(function(selectedItem) {
                console.log(selectedItem);
                // $ctrl.selected = selectedItem;
            }, function() {
                // $log.info('Modal dismissed at: ' + new Date());
            });

        },
        Return : function(){
            ReturnToBillboardEditorPage();
        },
        Add : function(){
            console.log($vm.vmData);
            // var ioTypePromise = null;
            // switch($vm.vmData.IO_TYPE){
            //     case "In":
            //     case "Out": 
            //         ioTypePromise = RestfulApi.InsertMSSQLData({
            //             insertname: 'Insert',
            //             table: 1,
            //             params: {
            //                 BB_TITLE : $vm.vmData.TITLE,
            //                 BB_CONTENT : $vm.vmData.CONTENT,
            //                 BB_POST_FROM : $vm.vmData.POST_FROM,
            //                 BB_POST_TOXX : $vm.vmData.POST_TOXX,
            //                 BB_IO_TYPE : $vm.vmData.IO_TYPE,
            //                 BB_CR_USER : $vm.profile.U_ID,
            //                 BB_CR_DATETIME : $filter('date')(_d, 'yyyy-MM-dd HH:mm:ss')
            //             }
            //         });
            //         break;
            //     case "All":
            //         ioTypePromise = RestfulApi.CRUDMSSQLDataByTask([
            //             {
            //                 crudType: 'Insert',
            //                 table: 1,
            //                 params: {
            //                     BB_TITLE : $vm.vmData.TITLE,
            //                     BB_CONTENT : $vm.vmData.CONTENT,
            //                     BB_POST_FROM : $vm.vmData.POST_FROM,
            //                     BB_POST_TOXX : $vm.vmData.POST_TOXX,
            //                     BB_IO_TYPE : "In",
            //                     BB_CR_USER : $vm.profile.U_ID,
            //                     BB_CR_DATETIME : $filter('date')(_d, 'yyyy-MM-dd HH:mm:ss')
            //                 }
            //             },
            //             {
            //                 crudType: 'Insert',
            //                 table: 1,
            //                 params: {
            //                     BB_TITLE : $vm.vmData.TITLE,
            //                     BB_CONTENT : $vm.vmData.CONTENT,
            //                     BB_POST_FROM : $vm.vmData.POST_FROM,
            //                     BB_POST_TOXX : $vm.vmData.POST_TOXX,
            //                     BB_IO_TYPE : "Out",
            //                     BB_CR_USER : $vm.profile.U_ID,
            //                     BB_CR_DATETIME : $filter('date')(_d, 'yyyy-MM-dd HH:mm:ss')
            //                 }
            //             }
            //         ]);
            //         break;
            // }

            // ioTypePromise.then(function (res) {
            //     console.log(res);
            //     // 上傳所有檔案
            //     // if($vm.uploader.getNotUploadedItems().length > 0){
            //     //     $vm.uploader.uploadAll();
            //     // }
            // }, function (err) {
            //     console.log(err);
            // });
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
                fileItem.url += '&rFilename='+rename;
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
        if(status == 200){
            // 儲存每個上傳檔案的資訊
            RestfulApi.InsertMSSQLData({
                insertname: 'Insert',
                table: 2,
                params: {
                    BBAF_O_FILENAME : response.oFilename,
                    BBAF_R_FILENAME : response.rFilename,
                    BBAF_FILEPATH : response.Filepath,
                    BBAF_CR_USER : $vm.profile.U_ID,
                    BBAF_CR_DATETIME : $filter('date')(_d, 'yyyy-MM-dd HH:mm:ss')
                }
            }).then(function (res) {
                console.log(res["returnData"]);
            }, function (err) {
                toaster.pop('error', "訊息", err, 3000);
            });
        }else{
            toaster.pop('error', "檔案上傳失敗", response.oFilename, 3000);
        }
    };
    $vm.uploader.onCompleteAll = function() {
        console.info('onCompleteAll');
    };

    function ReturnToBillboardEditorPage(){
        $state.transitionTo("app.settings.billboardeditor");
    };
})
.controller('AddPostGoalModalInstanceCtrl', function ($uibModalInstance, vmData, RestfulApi) {
    var $ctrl = this;
    $ctrl.mdData = [];

    $ctrl.MdInit = function (){
        var _request = null;

        switch(vmData.IO_TYPE){ 
            case "In":
                _request = {
                    querymain: 'news',
                    queryname: 'SelectSysGroup'
                };
                break;
            case "Out":
                _request = {
                    querymain: 'news',
                    queryname: 'SelectCompyInfo'
                };
                break;
            case "All":
                _request = {
                    querymain: 'news',
                    queryname: 'SelectSysGroupUnionCompyInfo'
                };
                break;
        }

        if (_request == null) return;

        RestfulApi.SearchMSSQLData(_request).then(function (res){
            // console.log(res["returnData"]);
            $ctrl.mdData = res["returnData"];
        }).finally(function() {
            HandleWindowResize($vm.mdDataGridApi);
        });
    };

    $ctrl.mdDataOptions = {
        data:  '$ctrl.mdData',
        columnDefs: [
            { name: 'CODE'     , displayName: '系統代碼' },
            { name: 'NAME'     , displayName: '名稱' },
            { name: 'IO_TYPE'  , displayName: '公佈類型', cellFilter: 'ioTypeFilter', enableFiltering: false }
        ],
        enableSorting: false,
        enableColumnMenus: false,
        enableFiltering: true,
        enableRowSelection: true,
        enableSelectAll: true,
        selectionRowHeaderWidth: 35,
        paginationPageSizes: [10, 25, 50],
        paginationPageSize: 10,
        onRegisterApi: function(gridApi){ 
            $ctrl.mdDataGridApi = gridApi;
        } 
    };

    $ctrl.ok = function() {
        $uibModalInstance.close($ctrl.mdDataGridApi.selection.getSelectedRows());
    };

    $ctrl.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
});