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

});