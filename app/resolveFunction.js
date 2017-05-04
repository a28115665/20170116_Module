function SysCodeResolve (RestfulApi, $q){
    return {
        get : function(pType){
            var deferred = $q.defer();
            
            RestfulApi.SearchMSSQLData({
                querymain: 'accountManagement',
                queryname: 'SelectAllSysCode',
                params: {
                    SC_TYPE : pType,
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
        }
    };
};

function SysCodeFilterResolve (RestfulApi, $q){
    return {
        get : function(pType){
            var deferred = $q.defer();
            
            RestfulApi.SearchMSSQLData({
                querymain: 'accountManagement',
                queryname: 'SelectAllSysCode',
                params: {
                    SC_TYPE : pType,
                    SC_STS : false
                }
            }).then(function (res){
                var data = res["returnData"] || [],
                    finalData = [];

                for(var i in data){
                    finalData.push({
                        value: data[i].SC_CODE,
                        label: data[i].SC_DESC
                    });
                }

                deferred.resolve(finalData);
            }, function (err){
                deferred.reject({});
            });
            
            return deferred.promise;
        }
    };
};
function CompyResolve (RestfulApi, $q){
    return {
        get : function(){
            var deferred = $q.defer();
            
            RestfulApi.SearchMSSQLData({
                querymain: 'externalManagement',
                queryname: 'SelectCompyInfo',
                params: {
                    CO_STS : false
                }
            }).then(function (res){
                var data = res["returnData"] || [],
                    finalData = {};

                for(var i in data){
                    finalData[data[i].CO_CODE] = data[i].CO_NAME
                }
                
                deferred.resolve(finalData);
            }, function (err){
                deferred.reject({});
            });
            
            return deferred.promise;
        }
    };
};
function UserGradeResolve (RestfulApi, $q){
    return {
        get : function(){
            var deferred = $q.defer();
            
            RestfulApi.SearchMSSQLData({
                querymain: 'account',
                queryname: 'SelectSysUserGrade',
                params: {
                    SUG_STS : false
                }
            }).then(function (res){
                var data = res["returnData"] || [],
                    finalData = {};

                for(var i in data){
                    finalData[data[i].SUG_GRADE] = data[i].SUG_NAME
                }
                
                deferred.resolve(finalData);
            }, function (err){
                deferred.reject({});
            });
            
            return deferred.promise;
        }
    };
};
function UserGradeFilterResolve (RestfulApi, $q){
    return {
        get : function(){
            var deferred = $q.defer();
            
            RestfulApi.SearchMSSQLData({
                querymain: 'account',
                queryname: 'SelectSysUserGrade',
                params: {
                    SUG_STS : false
                }
            }).then(function (res){
                var data = res["returnData"] || [],
                    finalData = [];

                for(var i in data){
                    finalData.push({
                        value: data[i].SUG_GRADE,
                        label: data[i].SUG_NAME
                    });
                }

                deferred.resolve(finalData);
            }, function (err){
                deferred.reject({});
            });
            
            return deferred.promise;
        }
    };
};
function UserInfoByGradeResolve (RestfulApi, $q){
    return {
        get : function(pID, pGRADE){
            var deferred = $q.defer();
            
            RestfulApi.SearchMSSQLData({
                querymain: 'compyDistribution',
                queryname: 'SelectUserbyGrade',
                params: {
                    U_ID : pID,
                    U_GRADE : pGRADE
                }
            }).then(function (res){
                var data = res["returnData"] || [],
                    finalData = {};

                for(var i in data){
                    finalData[data[i].U_ID] = data[i].U_NAME
                }
                
                deferred.resolve(finalData);
            }, function (err){
                deferred.reject({});
            });
            
            return deferred.promise;
        }
    };
};
function UserInfoByGradeFilterResolve (RestfulApi, $q){
    return {
        get : function(pID, pGRADE){
            var deferred = $q.defer();
            
            RestfulApi.SearchMSSQLData({
                querymain: 'compyDistribution',
                queryname: 'SelectUserbyGrade',
                params: {
                    U_ID : pID,
                    U_GRADE : pGRADE
                }
            }).then(function (res){
                var data = res["returnData"] || [],
                    finalData = [];

                for(var i in data){
                    finalData.push({
                        value: data[i].U_ID,
                        label: data[i].U_NAME
                    });
                }

                deferred.resolve(finalData);
            }, function (err){
                deferred.reject({});
            });
            
            return deferred.promise;
        }
    };
};

/*
    Some Function
 */
function HandleWindowResize (gridApi){
    setInterval( function() { 
        gridApi.core.handleWindowResize();
    }, 500);
};