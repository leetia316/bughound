var stateList = {
    url:'/list',
    templateUrl: 'view/list.html',
    controller: function($rootScope, $scope, $http, Session) {
    	var preSelectBugState,
    		stateNames = ['未解决', '已解决', '已关闭'];

    	$scope.Session = Session;
    	$scope.selectBugState = '';
    	$scope.stateName = stateNames[$scope.selectBugState];
    	$scope.subsbustr = '';
    	$scope.currentPage = 1;
		$scope.itemsPerPage = 15;
		$scope.isMine = false;

		// 业务列表
		$http.get('api/sbu/list').success(function(data) {
			$scope.sbus = data;
		});

       	$http.get('api/demand/list', {
       		params: {
       			limit: $scope.itemsPerPage,
       		}
       	}).success(function(data) {
       		console.info('raw response', data);
	        var result;
	        var demands = data;
	        // var total = data.count;
	        for(var i=0;i<demands.length;i++) {
	            result = new UAParser().setUA(demands[i].env.ua).getResult();
	            demands[i].device = result.device.model || '';
	            demands[i].files = demands[i].files || [];

	            // 文件计数
	            var tcount = demands[i].files && demands[i].files.length ? demands[i].files.length : 0;
	            if(demands[i].news && demands[i].news.length) {
	            	var tnews = demands[i].news;
	            	for(var j=0;j<tnews.length;j++) {
	            		if(tnews[j].files && tnews[j].files.length) {
	            			tcount += tnews[j].files.length;
	            		}
	            	}
	            }
	            demands[i].filescount = tcount;

	            // 状态名
	            demands[i].stateName = stateNames[demands[i].state];
	        }
	        console.info('需求数据', demands);
	        $scope.selectBugState = '';
	        $scope.isLoaded = true;
	        $scope.bugList = $scope.predlist = demands || [];
	    });

	    jQuery('.dsbuwrap').on('keyup', '#sbu_value', function(e) {
	    	$scope.subsbustr = jQuery('#sbu_value').val() || '';
	    	jQuery('#sbu_value').trigger('focus');
	    });

	    $scope.$watch('selectBugId', function(n, o, scope) {
	    	if(n&&!o) {
	    		preSelectBugState = scope.selectBugState;
	    		scope.selectBugState = '';
	    	} else if(!n&&o) {
	    		scope.selectBugState = preSelectBugState;
	    	}
	    });
	    $scope.$watch('selectBugState', function(n, o, scope) {
	    	scope.stateName = stateNames[n];
	    });
    }
}