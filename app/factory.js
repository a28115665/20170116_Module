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
        )
    };
})
.factory('Account', AccountResolve)
.factory('Role', RoleResolve)
.factory('Depart', DepartResolve)
.factory('Bool', BooleanResolve)
.factory('IOType', IOTypeResolve)

