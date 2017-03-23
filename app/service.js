angular.module('app')
.service('RestfulApi', function ($http, $q, Resource){

	this.SearchMSSQLData = function (dataSrc) {
	    // console.log(dataSrc);
	    var deferred = $q.defer();

	    Resource.CRUD.get(dataSrc, 
	    	function (pSResponse){
				deferred.resolve(pSResponse);
			},
	    	function (pFResponse){
	    		deferred.reject(pFResponse.data);
	    	});

	    return deferred.promise
	},

	this.InsertMSSQLData = function (dataSrc) {
	    // console.log(dataSrc);
	    var deferred = $q.defer();

	    Resource.CRUD.insert(dataSrc, {}, 
	    	function (pSResponse){
				deferred.resolve(pSResponse);
			},
	    	function (pFResponse){
	    		deferred.reject(pFResponse.data);
	    	});

	    return deferred.promise
	},

	this.UpdateMSSQLData = function (dataSrc) {
	    // console.log(dataSrc);
	    var deferred = $q.defer();

	    Resource.CRUD.update(dataSrc, {}, 
	    	function (pSResponse){
				deferred.resolve(pSResponse);
			},
	    	function (pFResponse){
	    		deferred.reject(pFResponse.data);
	    	});

	    return deferred.promise
	},

	this.DeleteMSSQLData = function (dataSrc) {
	    // console.log(dataSrc);
	    var deferred = $q.defer();

	    Resource.CRUD.remove(dataSrc, {}, 
	    	function (pSResponse){
				deferred.resolve(pSResponse);
			},
	    	function (pFResponse){
	    		deferred.reject(pFResponse.data);
	    	});

	    return deferred.promise
	};
})
.service('AuthApi', function ($http, $q, Resource){

	this.Login = function (dataSrc) {
	    // console.log(dataSrc);
	    var deferred = $q.defer();

	    Resource.LOGIN.get(dataSrc,
	    	function (pSResponse){
				deferred.resolve(pSResponse);
			},
	    	function (pFResponse){
	    		deferred.reject(pFResponse.data);
	    	});

	    return deferred.promise
	},

	this.Logout = function () {
	    Resource.LOGOUT.get();
	}
})
.service('ToolboxApi', function ($http, $q, Resource){

	this.ExportExcelByVar = function (dataSrc) {
	    // console.log(dataSrc);
	    var deferred = $q.defer();

	    Resource.EXPORTEXCELBYVAR.postByArraybuffer(dataSrc,
	    	function (pSResponse){
				deferred.resolve(pSResponse);
			},
	    	function (pFResponse){
	    		deferred.reject(pFResponse.data);
	    	});

	    return deferred.promise
	}
});