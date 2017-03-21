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
        LOGOUT : $resource('/auth/logout')
    };
})
.factory('Account', AccountResolve)
.factory('Role', RoleResolve)
.factory('Depart', DepartResolve)