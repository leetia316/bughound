var stateDetail = {
    url:'/detail/:id',
    templateUrl: 'view/detail.html',
    controller: function($rootScope, $scope, $http, $state, $stateParams, Session) {
        var stateNames = ['未完成', '已完成', '已关闭'];

        $scope.Session = Session;

    	$http.get('api/demand/get', {
    		params: {
    			id: $stateParams.id
    		}
    	}).success(function(data) {
    		data.pics = data.pics || [];
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
            }).success(function(data) {
                _POP_.toast('评论成功');
                console.log($scope.news, data)
                $scope.news.push(data);
                $scope.whatNowhandling = null;
            });
        }
        $scope.nowcompletefn = function() {
            $http.post('api/demand/update', {
                id: $scope.data._id,
                state: 1
            }).success(function() {
                _POP_.toast('需求已完成');
                $scope.data.state = 1;
            }).error(function() {
                _POP_.toast('未知错误');
            });
            $scope.whatNowhandling = null;
        }

        $scope.$watch('data.state', function(n, o, scope) {
            if(scope.data) {
                scope.data.stateName = stateNames[n] || '未知状态';
            }
        });
    }
}