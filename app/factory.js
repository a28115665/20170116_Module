angular.module('app')
.factory('Session', function () {
    var session = {};

    return {
        Set: function(pSession) {
            session = pSession;
        },

        Get: function() {
            return session;
        },

        Destroy: function() {
            session = {};
        }
    }

})
.factory('Resource', function ($resource){
    return {
        CRUD : $resource('/restful/crud', null,
            {
                'update': { method: 'PUT' },
                'upsert': { method: 'PATCH' },
                'insert': { method: 'POST' }
            }
        ),
        CRUDBYTASK : $resource('/restful/crudByTask'),
        LOGIN : $resource('/auth/login'),
        LOGOUT : $resource('/auth/logout'),
        RELOADSESSION : $resource('/auth/reLoadSession'),
        EXPORTEXCELBYVAR : $resource('/toolbox/exportExcelByVar', null, 
            {
                'postByArraybuffer': { 
                    method: 'GET',
                    responseType : 'arraybuffer',
                    transformResponse: function(data) {
                        return {
                            response: new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
                        };
                    }
                }
            }
        ),
        EXPORTEXCELBYSQL : $resource('/toolbox/exportExcelBySql', null, 
            {
                'postByArraybuffer': { 
                    method: 'GET',
                    responseType : 'arraybuffer',
                    transformResponse: function(data) {
                        return {
                            response: new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
                        };
                    }
                }
            }
        ),
        DOWNLOADFILES : $resource('/toolbox/downloadFiles', null, 
            {
                'postByArraybuffer': { 
                    method: 'GET',
                    responseType : 'arraybuffer',
                    transformResponse: function(data) {
                        return {
                            response: new Blob([data], { type: 'application/zip, application/octet-stream' })
                        };
                    }
                }
            }
        ),
        SENDMAIL : $resource('/toolbox/sendMail'),
        CHANGENATURE : $resource('/toolbox/changeNature'),
        COMPOSEMENU : $resource('/toolbox/composeMenu')
    };
})
.factory('SysCode', SysCodeResolve)
.factory('Compy', CompyResolve)
.factory('UserGrade', UserGradeResolve)
.factory('UserInfoByGrade', UserInfoByGradeResolve)
.factory('UserInfoByCompyDistribution', UserInfoByCompyDistributionResolve)
.factory('UserInfo', UserInfoResolve)
