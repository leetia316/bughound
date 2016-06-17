var stateSbulist = {
    url:'/sbulist',
    templateUrl: 'view/sbulist.html',
    controller: function($rootScope, $scope, $http) {
       	$http.get('api/sbu/list').success(function(data) {
       		$scope.sbuList = data;
            console.info('业务数据', data);
       	});

        $scope.toggleEditing = function(x, ic) {
            x.isEditing = !x.isEditing;
            if(x.isEditing) {
                x.oname = x.name;
            } else if(ic) {
                x.name = x.oname;
            } else {
                $http.post('api/sbu/rename', {
                    sid: x._id,
                    newname: x.name
                }).then(function(res) {
                    if(res && res.status===200) {
                        _POP_.toast('修改成功');
                    }
                }, function(res) {
                    if(res.status===500) {
                        _POP_.toast('已有同名业务');
                    } else if(res.status===400) {
                        _POP_.toast('什么都没做');
                    } else {
                        _POP_.toast('ERR '+res.status);
                    }
                    x.name = x.oname;
                });
            }
        }
    }
}