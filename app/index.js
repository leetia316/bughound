var jQuery = $;

angular.module('bughound', [
    'ui.router',
    'angularFileUpload',
    'angucomplete-alt',
    'ui.bootstrap'
], angular.noop)

.filter('scehtml', ['$sce', function($sce) {
    return function(text) {
        return $sce.trustAsHtml(text);
    }  
}])

.filter('fmtDateNormal', [function() {
    return function(text) {
        var date = new Date(text);
        if(date=='Invalid Date') {
            return '';
        }
        var now = new Date(),
            sepdays = Math.floor(now.getTime()/86400000) - Math.floor(date.getTime()/86400000);
        if(sepdays>7) {
            if(now.getFullYear()-date.getFullYear()>0) {
                return date.getFullYear()+'年'+(date.getMonth()+1)+'月'+date.getDate()+'日';
            } else {
                return (date.getMonth()+1)+'月'+date.getDate()+'日';
            }
        } else if(sepdays>0) {
            return sepdays + '天前';
        } else {
            if(now.getHours()-date.getHours()>0) {
                return (now.getHours()-date.getHours())+'小时前';
            } else if(now.getMinutes()-date.getMinutes()>0) {
                return (now.getMinutes()-date.getMinutes())+'分钟前';
            } else {
                return (now.getSeconds()-date.getSeconds())+'秒前';
            }
        }
    }
}])

.filter('regex', function() {
    return function(input, field, regex) {
        var patt = new RegExp(regex);
        var out = [];
        for(var i=0;i<input.length;i++) {
            if(patt.test(input[i][field])) {
                out.push(input[i]);
            }
        }
        return out;
    }
})

.filter('slice', function () {
    return function (inputArr, start, end) {
        var resultArr = [];

        if (!angular.isArray(inputArr)) { return inputArr; }
        if (start < 0) { start = 0; }
        if (end > inputArr.length) { end = inputArr.length; }

        for (var i = start; i < end; ++i) {
            resultArr.push(inputArr[i]);
        }
        return resultArr;
    };
})

.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs, ngModel) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            element.bind('change', function(event){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
                //附件预览
                scope.files = (event.srcElement || event.target).files || event.dataTransfer.files;
                scope.getFile();
            });
        }
    };
}])

.directive('onDocumentClick', ['$document',
  function($document) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {

        var onClick = function() {
          scope.$apply(function() {
            scope.$eval(attrs.onDocumentClick);
          });
        };

        $document.on('click', onClick);

        scope.$on('$destroy', function() {
          $document.off('click', onClick);
        });
      }
    };
  }
])

.directive('onOutsideElementClick', ['$document',
  function($document) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {

        element.on('click', function(e) {
          e.stopPropagation();
        });

        var onClick = function() {
          scope.$apply(function() {
            scope.$eval(attrs.onOutsideElementClick);
          });
        };

        $document.on('click', onClick);

        scope.$on('$destroy', function() {
          $document.off('click', onClick);
        });
      }
    };
  }
])

.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
    $urlRouterProvider.otherwise('list');  //无效路由

    $stateProvider
        .state('apply', stateApply)
        .state('list', stateList)
        .state('detail', stateDetail)
        .state('idlist', stateIdlist);
})

.service('Session', function($rootScope) {
    this.create = function(userErp, userName, userIsAdmin) {
        $rootScope.userErp = this.userErp = userErp;
        $rootScope.userName = this.userName = userName;
        $rootScope.userIsAdmin = this.userIsAdmin = !!userIsAdmin;
    }
    this.destory = function() {
        $rootScope.userErp = this.userErp = undefined;
        $rootScope.userName = this.userName = undefined;
        $rootScope.userIsAdmin = this.userIsAdmin = false;
    }
    return this;
})

.run(function($rootScope, $http, $state, FileUploader, Session) {
    $http.get('api/auth').then(function(res) {
        console.log(res.data)
        Session.create(res.data.erp, res.data.name, res.data.isAdmin);
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
                var data = res.data.data;
                if($scope.userErp) {
                    _POP_.toast('切换成功');
                } else {
                    _POP_.toast('登录成功');
                }
                Session.create(data.erp, data.name, data.isadmin);
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