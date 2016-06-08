'use strict';

angular.module('mine.fmtDateNormal', []).filter('fmtDateNormal', [function() {
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