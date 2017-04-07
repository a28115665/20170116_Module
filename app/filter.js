angular.module('app')
.filter('booleanFilter', function (Bool) {
 //  	var bool = {
	//     'true': '是',
	//     'false': '否'
	// };

	// return function(input) {
	// 	if (bool[input]) {
	// 	    return bool[input];
	// 	} else {
	// 	    return '';
	// 	}
	// };

	var resData = {};

	Bool.then(function (res){
		resData = res
	});

	var FilterFunction = function (input){
		return angular.isUndefined(resData[input]) ? '' : resData[input];
	}

	// 持續偵測
	FilterFunction.$stateful = true;

	return FilterFunction;
})
.filter('roleFilter', function (Role) {

	var resData = {};

	Role.then(function (res){
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
.filter('departFilter', function (Depart) {

	var resData = {};

	Depart.then(function (res){
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