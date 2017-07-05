angular.module('mine.scehtml', []).filter('scehtml', ['$sce', function ($sce) {
  return function (text) {
    return $sce.trustAsHtml(text)
  }
}])
