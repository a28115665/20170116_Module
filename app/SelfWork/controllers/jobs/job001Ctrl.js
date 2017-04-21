"use strict";

angular.module('app.selfwork').controller('Job001Ctrl', function ($scope, $stateParams, $state, AuthApi, Session, toaster, $uibModal, $templateCache, RestfulApi) {
    // console.log($stateParams, $state);

    var $vm = this;

    angular.extend(this, {
        Init : function(){
            // 不正常登入此頁面
            // if($stateParams.data == null){
            //     ReturnToEmployeejobsPage();
            // }else{
                $vm.vmData = $stateParams.data;

                LoadItemList();
            // }
        },
        profile : Session.Get(),
        searchCondition : {
            a : ['0A4JV163', '0A4JV164', '0A4JV165'],
            b : ['9577943035', '9577943094', '9577942883'],
            c : ['亞瑟仕'],
            d : ['黑貓']
        },
        defaultChoice : 'Left',
        gridMethod : {
            //加入黑名單
            banData : function(row){
                console.log(row);
                var modalInstance = $uibModal.open({
                    animation: true,
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    templateUrl: 'myModalContent.html',
                    controller: 'ModalInstanceCtrl',
                    controllerAs: '$ctrl',
                    // size: 'lg',
                    // appendTo: parentElem,
                    resolve: {
                        items: function() {
                            return row.entity;
                        }
                    }
                });

                modalInstance.result.then(function(selectedItem) {
                    // $ctrl.selected = selectedItem;
                }, function() {
                    // $log.info('Modal dismissed at: ' + new Date());
                });
            },
            //通報前線人員
            alertData : function(row){
                console.log(row);
            }
        },
        job001Options : {
            // data:  [
            //     {
            //         $$treeLevel : 0, a : '1', b : '0A4JV163', c : '9577943035', d : '包2饰品1纸袋2', e : '1', f : '', g : '1.2', h : '5', i : '個', j : '', k : '亞瑟仕', l : '黃韋岑', m : '台東縣台東市綠島鄉公館村大白沙32號', n : '0922769396', o : '不包稅', p : '黑貓'
            //     },
            //     {
            //         a : '1', b : '0A4JV163', c : '9577943094', d : '夹3饰品3纸袋3', e : '1', f : '', g : '1', h : '9', i : '個', j : '', k : '亞瑟仕', l : '林思晴', m : '高雄市鳳山區凱旋路182號', n : '0927282581', o : '不包稅', p : '黑貓'
            //     },
            //     {
            //         a : '1', b : '0A4JV164', c : '9577942883', d : '包2夹1饰品1纸袋3', e : '1', f : '', g : '3.1', h : '7', i : '個', j : '', k : '亞瑟仕', l : '許依琪', m : '台北市中山區新生北路二段60巷42號7樓', n : '0975356060', o : '不包稅', p : '黑貓'
            //     },
            //     {
            //         a : '1', b : '0A4JV164', c : '9577942883', d : '包2夹1饰品1纸袋3', e : '1', f : '', g : '3.1', h : '7', i : '個', j : '', k : '亞瑟仕', l : '許依琪', m : '台北市中山區新生北路二段60巷42號7樓', n : '0975356060', o : '不包稅', p : '黑貓'
            //     },
            //     {
            //         $$treeLevel : 0, a : '1', b : '0A4JV165', c : '9577942883', d : '包2夹1饰品1纸袋3', e : '1', f : '', g : '3.1', h : '7', i : '個', j : '', k : '亞瑟仕', l : '許依琪', m : '台北市中山區新生北路二段60巷42號7樓', n : '0975356060', o : '不包稅', p : '黑貓'
            //     },
            //     {
            //         a : '1', b : '0A4JV166', c : '9577942883', d : '包2夹1饰品1纸袋3', e : '1', f : '', g : '3.1', h : '7', i : '個', j : '', k : '亞瑟仕', l : '許依琪', m : '台北市中山區新生北路二段60巷42號7樓', n : '0975356060', o : '不包稅', p : '黑貓'
            //     }
            // ],
            data: '$vm.job001Data',
            columnDefs: [
                { name: 'a',        displayName: '正式/簡易報關/移倉', width: 154 },
                { name: 'IL_NEWBAGNO',        displayName: '清關條碼(袋號)', width: 129, grouping: { groupPriority: 0 }, cellTemplate: '<div><div ng-if="!col.grouping || col.grouping.groupPriority === undefined || col.grouping.groupPriority === null || ( row.groupHeader && col.grouping.groupPriority === row.treeLevel )" class="ui-grid-cell-contents" title="TOOLTIP">{{COL_FIELD CUSTOM_FILTERS}}</div></div>' },
                { name: 'IL_NEWSMALLNO',        displayName: '提單號(小號)', width: 115 },
                { name: 'd',        displayName: '品名', width: 115 },
                { name: 'e',        displayName: '件數', width: 115 },
                { name: 'f',        displayName: '產地', width: 115 },
                { name: 'g',        displayName: '重量', width: 115 },
                { name: 'h',        displayName: '數量', width: 115 },
                { name: 'i',        displayName: '單位', width: 115 },
                { name: 'j',        displayName: '收件者統編', width: 115 },
                { name: 'k',        displayName: '寄件人或公司', width: 115 },
                { name: 'l',        displayName: '收件人或公司', width: 115 },
                { name: 'm',        displayName: '收件地址', width: 300 },
                { name: 'n',        displayName: '收件電話', width: 115 },
                { name: 'o',        displayName: '是否包稅', width: 115 },
                { name: 'p',        displayName: '派送公司', width: 115 },
                { name: 'Options',  displayName: '操作', width: 220, cellTemplate: $templateCache.get('accessibilityToBA'), pinnedRight:true }
            ],
            enableFiltering: false,
            enableSorting: true,
            enableColumnMenus: false,
            // enableVerticalScrollbar: false,
		    enableRowSelection: true,
    		enableSelectAll: false,
            paginationPageSizes: [10, 25, 50],
            paginationPageSize: 10,
            treeRowHeaderAlwaysVisible: false,
            onRegisterApi: function(gridApi){
                $vm.job001GridApi = gridApi;
                // $vm.editorOrderGridApi.grid.registerRowsProcessor(function ( renderableRows ){
                //     var matcher = new RegExp($vm.filterValue);
                //     renderableRows.forEach(function(row) {
                //         var match = false;
                //         ['b', 'c', 'm', 'n', 'o'].forEach(function(field) {
                //             if (row.entity[field].match(matcher)) {
                //                 match = true;
                //             }
                //         });
                //         if (!match) {
                //             row.visible = false;
                //         }
                //     });
                //     return renderableRows;
                // }, 200);
            }
        },
        // Filter: function(){
        //     $vm.editorOrderGridApi.grid.refresh();
        // }
    });

    function LoadItemList(){
        RestfulApi.SearchMSSQLData({
            querymain: 'job001',
            queryname: 'SelectItemList',
            params: {
                // IL_SEQ: $vm.vmData.OL_SEQ
                IL_SEQ: 'AdminTest20170419101047'
            }
        }).then(function (res){
            console.log(res["returnData"]);
            $vm.job001Data = res["returnData"];
        }).finally(function() {
            HandleWindowResize($vm.job001GridApi);
        }); 
    };

    function ReturnToEmployeejobsPage(){
        $state.transitionTo($state.current.parent);
    };

})
.controller('ModalInstanceCtrl', function ($uibModalInstance, items) {
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