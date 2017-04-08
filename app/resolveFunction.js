function AccountResolve (RestfulApi, $q) {

    return {
        get : function(){
            var deferred = $q.defer();

            RestfulApi.SearchMSSQLData({
                querymain: 'accountManagement',
                queryname: 'SelectAllUserInfoNotWithAdmin'
            }).then(function (res){
                deferred.resolve(res["returnData"]);
            });

            return deferred.promise;
        }
    }
};
function RoleResolve (RestfulApi, $q) {
    var deferred = $q.defer();

    RestfulApi.SearchMSSQLData({
        querymain: 'accountManagement',
        queryname: 'SelectAllSysCode',
        params: {
            SC_TYPE : "Role",
            SC_STS : false
        }
    }).then(function (res){
        var data = res["returnData"] || [],
            finalData = {};

        for(var i in data){
            finalData[data[i].SC_CODE] = data[i].SC_DESC
        }
        
        deferred.resolve(finalData);
    }, function (err){
        deferred.reject({});
    });
    
    return deferred.promise;
};
function DepartResolve (RestfulApi, $q) {
    var deferred = $q.defer();

    RestfulApi.SearchMSSQLData({
        querymain: 'accountManagement',
        queryname: 'SelectAllSysCode',
        params: {
            SC_TYPE : "Depart",
            SC_STS : false
        }
    }).then(function (res){
        var data = res["returnData"] || [],
            finalData = {};

        for(var i in data){
            finalData[data[i].SC_CODE] = data[i].SC_DESC
        }

        deferred.resolve(finalData);
    }, function (err){
        deferred.reject({});
    });
    
    return deferred.promise;
};
function BooleanResolve (RestfulApi, $q) {
    var deferred = $q.defer();

    RestfulApi.SearchMSSQLData({
        querymain: 'accountManagement',
        queryname: 'SelectAllSysCode',
        params: {
            SC_TYPE : "Boolean",
            SC_STS : false
        }
    }).then(function (res){
        var data = res["returnData"] || [],
            finalData = {};

        for(var i in data){
            finalData[data[i].SC_CODE] = data[i].SC_DESC
        }

        deferred.resolve(finalData);
    }, function (err){
        deferred.reject({});
    });
    
    return deferred.promise;
};
function IOTypeResolve (RestfulApi, $q) {
    var deferred = $q.defer();

    RestfulApi.SearchMSSQLData({
        querymain: 'accountManagement',
        queryname: 'SelectAllSysCode',
        params: {
            SC_TYPE : "IOType",
            SC_STS : false
        }
    }).then(function (res){
        var data = res["returnData"] || [],
            finalData = {};

        for(var i in data){
            finalData[data[i].SC_CODE] = data[i].SC_DESC
        }

        deferred.resolve(finalData);
    }, function (err){
        deferred.reject({});
    });
    
    return deferred.promise;
};

/*
    Some Function
 */
function HandleWindowResize (gridApi){
    setInterval( function() { 
        gridApi.core.handleWindowResize();
    }, 500);
};