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

       	$http.get('api/demand/list').success(function(data) {
	        var result;
	        for(var i=0;i<data.length;i++) {
	            result = new UAParser().setUA(data[i].env.ua).getResult();
	            data[i].device = result.device.model || '';
	            data[i].files = data[i].files || [];
	            data[i].stateName = stateNames[data[i].state];
	        }
	        console.log(data);
	        $scope.selectBugState = '';
	        $scope.isLoaded = true;
	        $scope.bugList = $scope.predlist = data || [];
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