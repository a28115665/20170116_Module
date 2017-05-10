angular.module('app')
.filter('booleanFilter', function (SysCode) {

	var resData = {};

	LoadData()

	var FilterFunction = function (input, isLoad){
		if(isLoad){
			LoadData();
		}

		return angular.isUndefined(resData[input]) ? '' : resData[input];
	};
	
	function LoadData(){
		SysCode.get('Boolean').then(function (res){
			resData = res
		});
	}

	// 持續偵測
	FilterFunction.$stateful = true;

	return FilterFunction;
})
.filter('roleFilter', function (SysCode) {

	var resData = {};

	LoadData();

	var FilterFunction = function (input, isLoad){
		if(isLoad){
			LoadData();
		}

		if (!input) {
		    return '';
		} else {
		    return resData[input];
		}

	};
	
	function LoadData(){
		SysCode.get('Role').then(function (res){
			resData = res
		});
	}

	// 持續偵測
	FilterFunction.$stateful = true;

	return FilterFunction;

})
.filter('departFilter', function (SysCode) {

	var resData = {};

	LoadData();

	var FilterFunction = function (input, isLoad){
		if(isLoad){
			LoadData();
		}

		if (!input) {
		    return '';
		} else {
		    return resData[input];
		}

	};
	
	function LoadData(){
		SysCode.get('Depart').then(function (res){
			resData = res
		});
	}

	// 持續偵測
	FilterFunction.$stateful = true;

	return FilterFunction;

})
.filter('ioTypeFilter', function (SysCode) {

	var resData = {};

	LoadData();

	var FilterFunction = function (input, isLoad){
		if(isLoad){
			LoadData();
		}

		if (!input) {
		    return '';
		} else {
		    return resData[input];
		}

	};
	
	function LoadData(){
		SysCode.get('IOType').then(function (res){
			resData = res
		});
	}

	// 持續偵測
	FilterFunction.$stateful = true;

	return FilterFunction;

})
.filter('compyFilter', function (Compy) {

	var resData = {};

	LoadData();

	var FilterFunction = function (input, isLoad){
		if(isLoad){
			LoadData();
		}

		if (!input) {
		    return '';
		} else {
		    return resData[input];
		}

	};
	
	function LoadData(){
		Compy.get().then(function (res){
			resData = res
		});
	}

	// 持續偵測
	FilterFunction.$stateful = true;

	return FilterFunction;

})
.filter('gradeFilter', function (UserGrade) {

	var resData = {};

	LoadData();

	var FilterFunction = function (input, isLoad){
		if(isLoad){
			LoadData();
		}

		if (!input) {
		    return '';
		} else {
		    return resData[input];
		}

	};
	
	function LoadData(){
		UserGrade.get().then(function (res){
			resData = res
		});
	}

	// 持續偵測
	FilterFunction.$stateful = true;

	return FilterFunction;

})
.filter('userInfoByGradeFilter', function (UserInfoByGrade, Session) {

	var resData = {};

	LoadData();

	var FilterFunction = function (input, isLoad){
		if(isLoad){
			LoadData();
		}

		if (!input) {
		    return '';
		} else {
		    return resData[input];
		}

	};

	function LoadData(){
		UserInfoByGrade.get(Session.Get().U_ID, Session.Get().U_GRADE).then(function (res){
			resData = res
		});
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

})
.filter('dataMBSize', function () {

	return function (input){
		return angular.isUndefined(input) ? '' : (parseInt(input)/1024/1024).toFixed(2) + ' MB';
	};

});