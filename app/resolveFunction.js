// function SysCodeResolve (RestfulApi, $q){
//     return {
//         get : function(pType){
//             var deferred = $q.defer();
            
//             RestfulApi.SearchMSSQLData({
//                 querymain: 'accountManagement',
//                 queryname: 'SelectAllSysCode',
//                 params: {
//                     SC_TYPE : pType,
//                     SC_STS : false
//                 }
//             }).then(function (res){
//                 var data = res["returnData"] || [],
//                     finalData = {};

//                 for(var i in data){
//                     finalData[data[i].SC_CODE] = data[i].SC_DESC
//                 }
                
//                 deferred.resolve(finalData);
//             }, function (err){
//                 deferred.reject({});
//             });
            
//             return deferred.promise;
//         }
//     };
// };

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
/**
 * [UserInfoByGradeResolve description] 產生此User的部門與向下延伸的員工
 * @param {[type]} RestfulApi [description]
 * @param {[type]} $q         [description]
 * return 0 : 部門
 *        1 : 部門對應的人員
 */
function UserInfoByGradeResolve (RestfulApi, $q){
    return {
        get : function(pID, pGRADE, pDEPTS){
            var deferred = $q.defer();
            
            RestfulApi.SearchMSSQLData({
                querymain: 'compyDistribution',
                queryname: 'SelectUserbyGrade',
                params: {
                    U_ID : pID,
                    U_GRADE : pGRADE,
                    DEPTS : pDEPTS
                }
            }).then(function (res){
                var data = res["returnData"] || [],
                    finalData = {
                        // 部門
                        0 : [],
                        // 部門對應的人員
                        1 : {}
                    };

                for(var i in data){
                    // 檢查是否有重複的Object
                    var _flag = true;
                    for(var j in finalData[0]){
                        if(finalData[0][j].value == data[i].UD_DEPT){
                            _flag = false;
                            break;
                        }
                    }
                    // 如果沒有重複則Push
                    if(_flag){
                        finalData[0].push({
                            value: data[i].UD_DEPT,
                            label: data[i].SUD_NAME
                        });
                    }

                    // 如果無此部門就新增一個
                    if(angular.isUndefined(finalData[1][data[i].UD_DEPT])){
                        finalData[1][data[i].UD_DEPT] = [];
                    }

                    // Push員工
                    finalData[1][data[i].UD_DEPT].push({
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
function UserInfoResolve (RestfulApi, $q){
    return {
        get : function(){
            var deferred = $q.defer();
            
            RestfulApi.SearchMSSQLData({
                querymain: 'accountManagement',
                queryname: 'SelectUserInfoForFilter'
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