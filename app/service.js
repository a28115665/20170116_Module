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
	},

	this.CRUDMSSQLDataByTask = function (dataSrc) {
	    // console.log(dataSrc);
	    var deferred = $q.defer();

	    Resource.CRUDBYTASK.get(dataSrc, {}, 
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

	    		var objectUrl = URL.createObjectURL(pSResponse["response"]);
                var link = document.createElement('a');
                if (typeof link.download === 'string') {
                    // Firefox requires the link to be in the body
                    document.body.appendChild(link); 
                    link.download = angular.isUndefined(dataSrc.filename) ? '未知' : dataSrc.filename ;
                    link.href = objectUrl;
                    link.click();
                    // remove the link when done
                    document.body.removeChild(link); 
                } else {
                    location.replace(objectUrl);
                }

				deferred.resolve(pSResponse);
			},
	    	function (pFResponse){
	    		deferred.reject(pFResponse.data);
	    	});

	    return deferred.promise
	}
});