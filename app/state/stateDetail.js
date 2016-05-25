var stateDetail = {
    url:'/detail/:id',
    templateUrl: 'view/detail.html',
    controller: function($rootScope, $scope, $http, $state, $stateParams) {
    	$http.get('api/bug/get', {
    		params: {
    			id: $stateParams.id
    		}
    	}).success(function(data) {console.log(data)
    		data.pics = data.pics || [];
    		data.stateName = data.state==0 ? '未解决' : (data.state==1 ? '已解决' : '已关闭');
    		data.ua = new UAParser().setUA(data.env.ua).getResult();

    		$scope.data = data;
            console.log(data)
    	});
        // $http.get('api/user/list').success(function(data) {
        // 	$scope.userList = data;
        //     setTimeout(function() {
        //         jQuery('.handle .ui.dropdown').dropdown();
        //     },200);
        // });
        $scope.submit = function() {
            $http.post('api/bug/update', {
                id: $stateParams.id,
                state: 1
            }).success(function() {
                $rootScope.modToastText = '更新成功！';
                $rootScope.modToastClose = function() {
                    $rootScope.isPopupModToast = false;
                }
                $rootScope.isPopupModToast = true;
            });
        }

        $scope.swipe = function(step) {
            $state.go('detail', {id: parseInt($stateParams.id)+step});
        }
    }
}