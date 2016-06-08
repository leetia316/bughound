'use strict';

angular.module('mine.fileModel', []).directive('fileModel', ['$parse', function ($parse) {
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