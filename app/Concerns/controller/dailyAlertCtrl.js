"use strict";

angular.module('app.concerns').controller('DailyAlertCtrl', function ($scope, $stateParams, $state, AuthApi, Session, toaster, $uibModal, $templateCache, $timeout) {
    
    var $vm = this;

	angular.extend(this, {
        Init : function(){
            $scope.ShowTabs = true;
            $vm.LoadData();
        },
        profile : Session.Get(),
        defaultTab : 'hr1',
        TabSwitch : function(pTabID){
            return pTabID == $vm.defaultTab ? 'active' : '';
        },
        LoadData : function(){
            console.log($vm.defaultTab);
            switch($vm.defaultTab){
                case 'hr1':
                    // LoadBLFO();
                    break;
                case 'hr2':
                    // LoadBLFL();
                    break;
                case 'hr3':
                    // LoadBLFL();
                    break;
                case 'hr4':
                    // LoadBLFL();
                    break;
            }
        },
        dailyAlertPersonOptions : {
            data:  [
                {
                    a : '2017-02-09',
                    b : '297-64659291',
                    c : '2017-01-15',
                    d : 'CI5822',
                    e : 'HK',
                    f : '0A4JV163',
                    g : '9577943094',
                    h : '夹3饰品3纸袋3',
                    i : '亞瑟仕',
                    j : '許依琪',
                    k : '台北市中山區新生北路二段60巷42號7樓',
                    l : '0975356060',
                    m : '不包稅',
                    n : '黑貓'
                },
            ],
            columnDefs: [
                { name: 'a', displayName: '提單日期', width: 115 },
                { name: 'b', displayName: '主號', width: 115 },
                { name: 'c', displayName: '進口日期', width: 115 },
                { name: 'd', displayName: '班機', width: 115 },
                { name: 'e', displayName: '啟運國別', width: 115 },
                { name: 'f', displayName: '清關條碼(袋號)', width: 129 },
                { name: 'g', displayName: '提單號(小號)', width: 115 },
                { name: 'h', displayName: '品名', width: 115 },
                { name: 'i', displayName: '寄件人或公司', width: 115 },
                { name: 'j', displayName: '收件人或公司', width: 115 },
                { name: 'k', displayName: '收件地址', width: 300 },
                { name: 'l', displayName: '收件電話', width: 115 },
                { name: 'm', displayName: '是否包稅', width: 115 },
                { name: 'n', displayName: '派送公司', width: 115 }
            ],
            enableFiltering: false,
            enableSorting: false,
            enableColumnMenus: false,
            // enableVerticalScrollbar: false,
            paginationPageSizes: [10, 25, 50],
            paginationPageSize: 10,
            onRegisterApi: function(gridApi){
                $vm.dailyAlertPersonGridApi = gridApi;
            }
        },
        dailyAlertAddressOptions : {
            data:  [
                {
                    a : '2017-02-09',
                    b : '297-64659291',
                    c : '2017-01-15',
                    d : 'CI5822',
                    e : 'HK',
                    f : '0A4JV163',
                    g : '9577943094',
                    h : '夹3饰品3纸袋3',
                    i : '亞瑟仕',
                    j : '林思晴',
                    k : '高雄市鳳山區凱旋路182號',
                    l : '0927282581',
                    m : '不包稅',
                    n : '黑貓'
                }
            ],
            columnDefs: [
                { name: 'a', displayName: '提單日期', width: 115 },
                { name: 'b', displayName: '主號', width: 115 },
                { name: 'c', displayName: '進口日期', width: 115 },
                { name: 'd', displayName: '班機', width: 115 },
                { name: 'e', displayName: '啟運國別', width: 115 },
                { name: 'f', displayName: '清關條碼(袋號)', width: 129 },
                { name: 'g', displayName: '提單號(小號)', width: 115 },
                { name: 'h', displayName: '品名', width: 115 },
                { name: 'i', displayName: '寄件人或公司', width: 115 },
                { name: 'j', displayName: '收件人或公司', width: 115 },
                { name: 'k', displayName: '收件地址', width: 300 },
                { name: 'l', displayName: '收件電話', width: 115 },
                { name: 'm', displayName: '是否包稅', width: 115 },
                { name: 'n', displayName: '派送公司', width: 115 }
            ],
            enableFiltering: false,
            enableSorting: false,
            enableColumnMenus: false,
            // enableVerticalScrollbar: false,
            paginationPageSizes: [10, 25, 50],
            paginationPageSize: 10,
            onRegisterApi: function(gridApi){
                $vm.dailyAlertAddressGridApi = gridApi;
            }
        },
        dailyAlertPAndAOptions : {
            data:  [
                {
                    a : '2017-02-09',
                    b : '297-64659291',
                    c : '2017-01-15',
                    d : 'CI5822',
                    e : 'HK',
                    f : '0A4JV163',
                    g : '9577943094',
                    h : '夹3饰品3纸袋3',
                    i : '亞瑟仕',
                    j : '林思晴',
                    k : '高雄市鳳山區凱旋路182號',
                    l : '0927282581',
                    m : '不包稅',
                    n : '黑貓'
                },
                {
                    a : '2017-02-09',
                    b : '297-64659291',
                    c : '2017-01-15',
                    d : 'CI5822',
                    e : 'HK',
                    f : '0A4JV163',
                    g : '9577943094',
                    h : '夹3饰品3纸袋3',
                    i : '亞瑟仕',
                    j : '許依琪',
                    k : '台北市中山區新生北路二段60巷42號7樓',
                    l : '0975356060',
                    m : '不包稅',
                    n : '黑貓'
                },
            ],
            columnDefs: [
                { name: 'a', displayName: '提單日期', width: 115 },
                { name: 'b', displayName: '主號', width: 115 },
                { name: 'c', displayName: '進口日期', width: 115 },
                { name: 'd', displayName: '班機', width: 115 },
                { name: 'e', displayName: '啟運國別', width: 115 },
                { name: 'f', displayName: '清關條碼(袋號)', width: 129 },
                { name: 'g', displayName: '提單號(小號)', width: 115 },
                { name: 'h', displayName: '品名', width: 115 },
                { name: 'i', displayName: '寄件人或公司', width: 115 },
                { name: 'j', displayName: '收件人或公司', width: 115 },
                { name: 'k', displayName: '收件地址', width: 300 },
                { name: 'l', displayName: '收件電話', width: 115 },
                { name: 'm', displayName: '是否包稅', width: 115 },
                { name: 'n', displayName: '派送公司', width: 115 }
            ],
            enableFiltering: false,
            enableSorting: false,
            enableColumnMenus: false,
            // enableVerticalScrollbar: false,
            paginationPageSizes: [10, 25, 50],
            paginationPageSize: 10,
            onRegisterApi: function(gridApi){
                $vm.dailyAlertPAndAGridApi = gridApi;
            }
        },
        GridResize : HandleWindowResize
    });

})