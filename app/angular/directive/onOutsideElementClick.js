'use strict';

angular.module('mine.onOutsideElementClick', []).directive('onOutsideElementClick', ['$document',
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