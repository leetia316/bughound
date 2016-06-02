var stateDetail = {
    url:'/detail/:id',
    templateUrl: 'view/detail.html',
    controller: function($rootScope, $scope, $http, $state, $stateParams) {
    	$http.get('api/demand/get', {
    		params: {
    			id: $stateParams.id
    		}
    	}).success(function(data) {
    		data.pics = data.pics || [];
    		data.stateName = data.state==0 ? '未解决' : (data.state==1 ? '已解决' : '已关闭');
    		data.ua = new UAParser().setUA(data.env.ua).getResult();

    		$scope.data = data;
            console.log(data)
    	});

        $http.get('api/news/get', {
            params: {
                demand: $stateParams.id
            }
        }).success(function(data) {
            $scope.news = data;
        });

        $scope.submit = function() {
            $http.post('api/demand/update', {
                id: $stateParams.id,
                state: 1
            }).success(function() {
                _POP_.toast('更新成功');
            });
        }

        $scope.nowcommentfn = function() {
            if(!$scope.nowcomment) { _POP_.toast('你好像没有写什么');return; }

            $http.post('api/news/add', {
                demand: $scope.data._id,
                type: 1,
                comment: $scope.nowcomment
            }).success(function() {
                _POP_.toast('评论成功');
                $scope.whatNowhandling=null
            });
        }
    }
}