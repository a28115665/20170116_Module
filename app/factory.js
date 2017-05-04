angular.module('app')
.factory('Session', function ($rootScope, $http) {
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
                'insert': { method: 'POST'}
            }
        ),
        CRUDBYTASK : $resource('/restful/crudByTask'),
        LOGIN : $resource('/auth/login'),
        LOGOUT : $resource('/auth/logout'),
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
        CHANGENATURE : $resource('/toolbox/changeNature')
    };
})
.factory('SysCode', SysCodeResolve)
.factory('SysCodeFilter', SysCodeFilterResolve)
.factory('Compy', CompyResolve)
.factory('UserGrade', UserGradeResolve)
.factory('UserGradeFilter', UserGradeFilterResolve)
.factory('UserInfoByGrade', UserInfoByGradeResolve)
.factory('UserInfoByGradeFilter', UserInfoByGradeFilterResolve)
