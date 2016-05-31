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
	    	
	    	if(!$scope.d_title) { _POP_.toast('需求名称不能为空'); return; }

	    	var uploadedList = [];
	        $scope.showSubmiting = true;
	        angular.forEach($scope.uploader.queue, function(v, k) {
	        	if(v.isSuccess) {
	        		uploadedList.push({name:v.remoteName, oname:v.file.name, size:v.file.size, type:v.file.type});
	        	}
	        });

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
			}).catch(function(res, a) {
				if(res.status===404) {
					$scope.showSubmiting = false;
					_POP_.toast('申请失败');
				}
			});
	    }
    }
}