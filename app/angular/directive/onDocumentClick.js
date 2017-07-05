angular.module('mine.onDocumentClick', []).directive('onDocumentClick', ['$document',
  function ($document) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var onClick = function () {
          scope.$apply(function () {
            scope.$eval(attrs.onDocumentClick)
          })
        }

        $document.on('click', onClick)

        scope.$on('$destroy', function () {
          $document.off('click', onClick)
        })
      }
    }
  }
])
