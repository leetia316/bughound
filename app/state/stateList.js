var stateList = {
    url:'/list',
    templateUrl: 'view/list.html',
    controller: function($rootScope, $scope, $http) {
    	$scope.currentPage = 1;
		$scope.itemsPerPage = 15;

       	$http.get('api/bug/list').success(function(data) {
	        var result,
	            stateName = ['未解决', '已解决', '已关闭'];
	        for(var i=0;i<data.length;i++) {
	            result = new UAParser().setUA(data[i].ua).getResult();
	            data[i].device = result.device.model || '';
	            data[i].pics = data[i].pics ? JSON.parse(data[i].pics) : [];
	            data[i].stateName = stateName[data[i].state];
	        }
	        console.log(data);
	        $scope.selectBugState = 0;
	        $scope.isLoaded = true;
	        $scope.bugList = data || [];
	    });
    }
}