angular.module('app')
.filter('booleanFilter', function (SysCode) {

	var resData = {};

	SysCode.get('Boolean').then(function (res){
		resData = res
	});

	var FilterFunction = function (input){
		return angular.isUndefined(resData[input]) ? '' : resData[input];
	}

	// 持續偵測
	FilterFunction.$stateful = true;

	return FilterFunction;
})
.filter('roleFilter', function (SysCode) {

	var resData = {};

	SysCode.get('Role').then(function (res){
		resData = res
	});

	var FilterFunction = function (input){
		if (!input) {
		    return '';
		} else {
		    return resData[input];
		}

	}

	// 持續偵測
	FilterFunction.$stateful = true;

	return FilterFunction;

})
.filter('departFilter', function (SysCode) {

	var resData = {};

	SysCode.get('Depart').then(function (res){
		resData = res
	});

	var FilterFunction = function (input){
		if (!input) {
		    return '';
		} else {
		    return resData[input];
		}

	}

	// 持續偵測
	FilterFunction.$stateful = true;

	return FilterFunction;

})
.filter('ioTypeFilter', function (SysCode) {

	var resData = {};

	SysCode.get('IOType').then(function (res){
		resData = res
	});

	var FilterFunction = function (input){
		if (!input) {
		    return '';
		} else {
		    return resData[input];
		}

	}

	// 持續偵測
	FilterFunction.$stateful = true;

	return FilterFunction;

})
.filter('dateFilter', function ($filter) {

	return function (input){
		if (!input) {
		    return '';
		} else {
		    return $filter('date')(input.replace(/\Z/g, ''), 'yyyy-MM-dd');
		}

	};

})
.filter('datetimeFilter', function ($filter) {

	return function (input){
		if (!input) {
		    return '';
		} else {
		    return $filter('date')(input.replace(/\Z/g, ''), 'yyyy-MM-dd HH:mm:ss');
		}

	};

});