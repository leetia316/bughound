var stateApply = {
    url:'/apply',
    templateUrl: 'view/apply.html',
    controller: function($rootScope, $scope, $http, FileUploader) {
       	var gIdx = 0,
			files = [];

		// 业务列表
		$http.get('api/sbu/list').success(function(data) {
			$scope.sbus = data;
		});

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
	    	if(!$scope.d_sbu && !jQuery('#sbu_value').val()) { _POP_.toast('所属业务不能为空'); return; }

	    	var uploadedList = [];
	        $scope.showSubmiting = true;
	        angular.forEach($scope.uploader.queue, function(v, k) {
	        	if(v.isSuccess) {
	        		uploadedList.push({name:v.remoteName, oname:v.file.name, size:v.file.size, type:v.file.type});
	        	}
	        });

			$http.post('api/demand/add', {
				title: $scope.d_title,
				desc: jQuery('#editor').froalaEditor('html.get'),
				files: uploadedList,
				sbu: $scope.d_sbu ? $scope.d_sbu.originalObject._id : null,
				sbustr: jQuery('#sbu_value').val(),

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

	    jQuery(function(){
      		jQuery('#editor').froalaEditor({
				toolbarButtons: ['bold', 'italic', 'underline', 'strikeThrough', 'paragraphFormat', 'color', 'emoticons', 'insertLink', '|', 'formatOL', 'formatUL', 'align', 'undo', 'redo'],				// Colors list.
				colorsBackground: [
				  '#15E67F', '#E3DE8C', '#D8A076', '#D83762', '#76B6D8', '#FFFFFF',
				  '#1C7A90', '#249CB8', '#4ABED9', '#FBD75B', '#FBE571', 'REMOVE'
				],  
				heightMin: 200,
				heightMax: 500,
				colorsDefaultTab: 'background',
				linkAlwaysBlank: true,
				colorsStep: 6,
				colorsText: [
				  '#666666', '#15E67F', '#E3DE8C', '#D8A076', '#D83762', '#76B6D8',
				  '#FFFFFF', '#1C7A90', '#249CB8', '#4ABED9', '#FBD75B', 'REMOVE'
				]
			});
			jQuery(document).on('click', function() {
				console.log()
			});
    	});
    }
}