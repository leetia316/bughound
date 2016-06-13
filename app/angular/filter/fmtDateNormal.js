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
            var seph = now.getHours()-date.getHours();
            var sepm = now.getMinutes()-date.getMinutes();
            var seps = now.getSeconds()-date.getSeconds();
            if(seph>0) {
                // 60-(now-past) = 60-past+now，(sepm+60)<60 等同 sepm<0
                if(seph===1 && sepm<0) {
                    return (sepm+60)+'分钟前';
                } else {
                    return seph+'小时前';
                }
            } else if(sepm>0) {
                if(sepm===1 && seps<0) {
                    return (seps+60)+'秒前';
                } else {
                    return sepm+'分钟前';
                }
            } else {
                return seps+'秒前';
            }
        }
    }
}])