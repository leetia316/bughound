'use strict';

angular.module('mine.regex', []).filter('regex', function() {
    return function(input, field, regex) {
        regex = regex.replace(/\s/g, '');
        if(!input) {return undefined;}
        if(!!regex) {
            var patt = new RegExp(regex);
            var out = [];
            var fields = field.split('.');
            // console.log(field, regex)
            OUTSIDE:
            for(var i=0;i<input.length;i++) {
                var val = input[i];
                var preval = input[i];
                for(var j=0;j<fields.length;j++) {
                    if(val) {
                        val = val[ fields[j] ];
                    } else {
                        continue OUTSIDE;
                    }
                }
                if(patt.test(val)) {
                    out.push(preval);
                }
            }
            return out;
        } else {
            return input;
        }
    }
})