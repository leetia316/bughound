
var angular = require('angular')
var uirouter = require('@uirouter/angularjs')
var angularFileUpload = require('angular-file-upload')
var angucompleteAlt = require('angucomplete-alt')
var angularUIBootstrap = require('angular-ui-bootstrap')

var mineScehtml = require('./angular/filter/scehtml')
var mineFmtDateNormal = require('./angular/filter/fmtDateNormal')
var mineRegex = require('./angular/filter/regex')
var mineSlice = require('./angular/filter/slice')

var mineFileModel = require('./angular/directive/fileModel')
var mineOnDocumentClick = require('./angular/directive/onDocumentClick')
var mineOnOutsideElementClick = require('./angular/directive/onOutsideElementClick')

var mineSession = require('./angular/service/Session')

var stateApply = require('./state/apply')
var stateGallery = require('./state/gallery')
var stateDetail = require('./state/detail')
var stateUsers = require('./state/users')
var stateBusiness = require('./state/business')

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
]).factory('myInterceptor', function ($q) {
  return {
    response: function (response) {
      return response
    },
    responseError: function (response) {
      if (response.status === 419) {
        _POP_.toast('Error code : 419 - [abbr] TMR')
      }
      return $q.reject(response)
    }
  }
}).config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
  $httpProvider.interceptors.push('myInterceptor')

  $urlRouterProvider.otherwise('gallery')

  $stateProvider
    .state('apply', stateApply)
    .state('gallery', stateGallery)
    .state('detail', stateDetail)
    .state('users', stateUsers)
    .state('business', stateBusiness)
}).run(function ($rootScope, $http, $state, FileUploader, Session) {
  $http.get('api/auth').then(function (res) {
    console.info('用户信息', res.data)
    Session.create(res.data._id, res.data.erp, res.data.name, res.data.isAdmin)
  })

  $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
    $rootScope.navidx = toState.name
  })
}).controller('mainctrl', function ($scope, $http, $state, Session) {
  // ----- 登录 -----
  $scope.signin = function () {
    if (!$scope.signinErp) {
      $scope.signinErpHaserror = true
      _POP_.toast('请输入ERP')
    } else {
      $scope.signinErpHaserror = false
    }
    $http.post('api/user/signin', {
      erp: $scope.signinErp
    }).then(function (res) {
      if (res.data.state === 'success') {
        var user = res.data.user
        // console.log(user)
        if ($scope.userErp) {
          _POP_.toast('切换成功')
        } else {
          _POP_.toast('登录成功')
        }
        Session.create(user._id, user.erp, user.name, user.isadmin)
        $scope.showLogin = false
      } else {
        _POP_.toast(res.data.msg || '登录失败')
      }
    })
  }

  // ----- 登出 -----
  $scope.signout = function () {
    $http.post('api/user/signout').then(function (res) {
      Session.destory()
    })
  }
})
