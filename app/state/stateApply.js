var stateApply = {
    url:'/apply',
    templateUrl: 'view/apply.html',
    controller: function($rootScope, $scope, $http, FileUploader) {
       	var gIdx = 0,
			files = [];

		// 文件上传器
	    $scope.uploader = new FileUploader({
	    	url: 'api/upload'
    	});

	    // 每个文件上传成功后记录在远程存储的文件名
    	$scope.uploader.onSuccessItem  = function(item, res, status, headers) {
    		if(status==200){item.remoteName = res;}
    	}

	    $scope.submit = function() {
	    	var uploadedList = [];
	        $scope.showSubmiting = true;
	        angular.forEach($scope.uploader.queue, function(v, k) {
	        	if(v.isSuccess) {
	        		uploadedList.push(v.remoteName);
	        	}
	        });
	        console.log(uploadedList)

			$http.post('api/demand/add', {
				title: $scope.d_title,
				desc: $scope.d_desc || '',
				files: uploadedList,

				// ENV
			    width: document.documentElement.clientWidth,
			    height: document.documentElement.clientHeight,
			    dpr: window.devicePixelRatio,
			    ua: navigator.userAgent
			}).success(function(data) {
				console.log(data)
			    $scope.showSubmiting = false;
			    $scope.bugid = data;
			    $scope.isSubmitSucc = true;
			});
	    }
    }
}