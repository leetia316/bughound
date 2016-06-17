var jQuery = $;

angular.module('rocket', [
    'ui.router',
    'angularFileUpload',
    'angucomplete-alt',
    'ui.bootstrap',

    // Filter
    'mine.scehtml',
    'mine.fmtDateNormal',
    'mine.regex',
    'mine.slice',

    // Directive
    'mine.fileModel',
    'mine.onDocumentClick',
    'mine.onOutsideElementClick',

    // Service
    'mine.Session'
], angular.noop)

.factory('myInterceptor', function($q) {
    return {
        response: function (response) { return response; },
        responseError: function(response) {
            if (response.status === 419){
                _POP_.toast('Error code : 419 - [abbr] TMR');
            }
            return $q.reject(response);
        }
    };
})

.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
    $httpProvider.interceptors.push('myInterceptor');

    $urlRouterProvider.otherwise('list');  //无效路由

    $stateProvider
        .state('apply', stateApply)
        .state('list', stateList)
        .state('detail', stateDetail)
        .state('idlist', stateIdlist)
        .state('sbulist', stateSbulist);
})

.run(function($rootScope, $http, $state, FileUploader, Session) {
    $http.get('api/auth').then(function(res) {
        console.info('用户信息', res.data);
        Session.create(res.data._id, res.data.erp, res.data.name, res.data.isAdmin);
    });

    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        $rootScope.navidx = toState.name;
    });
})

.controller('mainctrl', function($scope, $http, $state, Session) {

    // ----- 登录 -----
    $scope.signin = function() {
        if(!$scope.signinErp) {
            $scope.signinErpHaserror = true;
            _POP_.toast('请输入ERP');
        } else {
            $scope.signinErpHaserror = false;
        }
        $http.post('api/user/signin', {
            erp: $scope.signinErp
        }).then(function(res) { 
            if(res.data.state=='success') {
                var user = res.data.user;
                console.log(user)
                if($scope.userErp) {
                    _POP_.toast('切换成功');
                } else {
                    _POP_.toast('登录成功');
                }
                Session.create(user._id, user.erp, user.name, user.isadmin);
                $scope.showLogin = false;
            } else {
                _POP_.toast(res.data.msg || '登录失败');
            }
        });
    }

    // ----- 登出 -----
    $scope.signout = function() {
        $http.post('api/user/signout').then(function(res) {
            Session.destory();
        });
    }

});