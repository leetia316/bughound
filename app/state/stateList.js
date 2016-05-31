var stateList = {
    url:'/list',
    templateUrl: 'view/list.html',
    controller: function($rootScope, $scope, $http) {
    	var preSelectBugState,
    		stateNames = ['未解决', '已解决', '已关闭'];

    	$scope.currentPage = 1;
		$scope.itemsPerPage = 15;

       	$http.get('api/demand/list').success(function(data) {
	        var result;
	        for(var i=0;i<data.length;i++) {
	            result = new UAParser().setUA(data[i].env.ua).getResult();
	            data[i].device = result.device.model || '';
	            data[i].files = data[i].files || [];
	            data[i].stateName = stateNames[data[i].state];
	        }
	        console.log(data);
	        $scope.selectBugState = 0;
	        $scope.isLoaded = true;
	        $scope.bugList = data || [];
	    });

	    // $http.get('api/demand/list').success(function(data) {
	        
	    // });

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