var stateDetail = {
    url:'/detail/:id',
    templateUrl: 'view/detail.html',
    controller: function($rootScope, $scope, $http, $stateParams) {
    	$scope.slidepic = function() {
    		jQuery('.shape').shape('flip right');
    		$scope.activePicIdx = ($scope.activePicIdx+1)%($scope.data.pics.length);
    	}
    	$http.get('api/bug/getbyid', {
    		params: {
    			id: $stateParams.id
    		}
    	}).success(function(data) {
    		data.pics = data.pics ? JSON.parse(data.pics) : [];
    		data.stateName = data.state==0 ? '未解决' : (data.state==1 ? '已解决' : '已关闭');
    		data.ua = new UAParser().setUA(data.ua).getResult();

    		$scope.activePicIdx = 0;
            $scope.selectBugState = 1;
    		$scope.data = data;
            console.log(data)
    	});
    	$http.get('api/user/list').success(function(data) {
    		$scope.userList = data;
            setTimeout(function() {
                jQuery('.handle .ui.dropdown').dropdown();
            },200);
    	});
        $scope.submit = function() {
            $http.post('api/bug/update', {
                id: $stateParams.id,
                solver: $scope.bugExecutor || null,
                state: $scope.selectBugState
            }).success(function() {
                $rootScope.modToastText = '更新成功！';
                $rootScope.modToastClose = function() {
                    $rootScope.isPopupModToast = false;
                }
                $rootScope.isPopupModToast = true;
            });
        }
    }
}