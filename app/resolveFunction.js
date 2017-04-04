function AccountResolve (RestfulApi, $q) {
    var deferred = $q.defer();

    RestfulApi.SearchMSSQLData({
        querymain: 'accountManagement',
        queryname: 'SelectAllUserInfoNotWithAdmin'
    }).then(function (res){
        var data = res["returnData"] || [],
            finalData = [];

        for(var i in data){
            finalData.push({
                U_ID      : data[i]['U_ID'],
                U_PW      : data[i]['U_PW'],
                U_Name    : data[i]['U_Name'],
                U_Email   : data[i]['U_Email'],
                U_Role    : data[i]['U_Role'],
                U_Depart  : data[i]['U_Depart'],
                U_Check   : data[i]['U_Check']
            });
        }

        deferred.resolve(finalData);
    });

    return deferred.promise;
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