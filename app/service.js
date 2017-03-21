angular.module('app')
.service('RestfulApi', function ($http, $q, Resource){

	this.SearchMSSQLData = function (dataSrc) {
	    // console.log(dataSrc);
	    var deferred = $q.defer();

	    Resource.CRUD.get(dataSrc, 
	    	function (data, status, headers, config){
	    		deferred.resolve({
	    			data : data,
	    			status : status,
	    			headers : headers,
	    			config : config
	    		});
	    	},
	    	function (data, status, headers, config){
	    		deferred.reject({
	    			data : data,
	    			status : status,
	    			headers : headers,
	    			config : config
	    		});
	    	})
	    return deferred.promise
	},

	this.InsertMSSQLData = function (dataSrc) {
	    // console.log(dataSrc);
	    var deferred = $q.defer();

	    Resource.CRUD.insert(dataSrc, {}, 
	    	function (data, status, headers, config){
	    		deferred.resolve({
	    			data : data,
	    			status : status,
	    			headers : headers,
	    			config : config
	    		});
	    	},
	    	function (data, status, headers, config){
	    		deferred.reject({
	    			data : data,
	    			status : status,
	    			headers : headers,
	    			config : config
	    		});
	    	})
	    return deferred.promise
	},

	this.UpdateMSSQLData = function (dataSrc) {
	    // console.log(dataSrc);
	    var deferred = $q.defer();

	    Resource.CRUD.update(dataSrc, {}, 
	    	function (data, status, headers, config){
	    		deferred.resolve({
	    			data : data,
	    			status : status,
	    			headers : headers,
	    			config : config
	    		});
	    	},
	    	function (data, status, headers, config){
	    		deferred.reject({
	    			data : data,
	    			status : status,
	    			headers : headers,
	    			config : config
	    		});
	    	})
	    return deferred.promise
	},

	this.DeleteMSSQLData = function (dataSrc) {
	    // console.log(dataSrc);
	    var deferred = $q.defer();

	    Resource.CRUD.remove(dataSrc, {}, 
	    	function (data, status, headers, config){
	    		deferred.resolve({
	    			data : data,
	    			status : status,
	    			headers : headers,
	    			config : config
	    		});
	    	},
	    	function (data, status, headers, config){
	    		deferred.reject({
	    			data : data,
	    			status : status,
	    			headers : headers,
	    			config : config
	    		});
	    	})
	    return deferred.promise
	};
})
.service('AuthApi', function ($http, $q, Resource){

	this.Login = function (dataSrc) {
	    // console.log(dataSrc);
	    var deferred = $q.defer();

	    Resource.LOGIN.get(dataSrc,
	    	function (data, status, headers, config){
	    		deferred.resolve({
	    			data : data,
	    			status : status,
	    			headers : headers,
	    			config : config
	    		});
	    	},
	    	function (data, status, headers, config){
	    		deferred.reject({
	    			data : data,
	    			status : status,
	    			headers : headers,
	    			config : config
	    		});
	    	})
	    return deferred.promise
	},

	this.Logout = function () {
	    Resource.LOGOUT.get();
	}
})