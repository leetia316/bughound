angular.module('mine.Session', []).service('Session', function ($rootScope) {
  this.create = function (userId, userErp, userName, userIsAdmin) {
    $rootScope.userId = this.userId = userId
    $rootScope.userErp = this.userErp = userErp
    $rootScope.userName = this.userName = userName
    $rootScope.userIsAdmin = this.userIsAdmin = !!userIsAdmin
  }
  this.destory = function () {
    $rootScope.userId = this.userId = undefined
    $rootScope.userErp = this.userErp = undefined
    $rootScope.userName = this.userName = undefined
    $rootScope.userIsAdmin = this.userIsAdmin = false
  }
  return this
})
