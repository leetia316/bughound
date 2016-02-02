var stateApply = {
    url:'/apply?title&url',
    templateUrl: 'view/apply.html',
    controller: function($rootScope, $scope, $http, $stateParams) {
    	var url2b = [
    		{path:/\/qwd\//, business:'京享街'},
    		{path:/\/sh\//, business:'拍拍二手'}
    	];
       	var gIdx = 0,
			pics = [];
	    $scope.filesList = [];
	    $scope.bugPageTit = $stateParams.title;
	    $scope.bugPageUrl = $stateParams.url;

	    for(var i=0;i<url2b.length;i++) {
	    	if(url2b[i].path.exec($scope.bugPageUrl)) {
	    		$scope.bugBusiness = url2b[i].business;
	    		break;
	    	}
	    }

	    $scope.getFile = function () {
	        var i, reader = new FileReader(),
	            files = $scope.files;
	        for(i=0; i<files.length; i++) {
	            if(files[i].type.indexOf('image')==0) {
	                var reader = new FileReader();
	                reader.onload = (function(file, gid) {
	                    return function(e) {
	                        file.src = e.target.result;
	                        file.index = gid;
	                        $scope.filesList.push(file);
	                        $scope.$apply();
	                    }
	                })(files[i], gIdx++);
	                reader.readAsDataURL(files[i]);
	            }
	        }
	    };
	    $scope.delFile = function(idx) {
	        $scope.filesList.splice(idx, 1);
	    }

	    $scope.submit = function() {
	        $scope.showSubmiting = true;
	        function upload(file) {
	            var formData = new FormData();
	            var oReq = new XMLHttpRequest();
	            if (oReq.upload) {
	                // 文件上传成功或是失败
	                oReq.onreadystatechange = function(e) {
	                    if (oReq.readyState == 4) {
	                        if (oReq.status == 200) {
	                            jQuery('#uploadProgress_' + file.index).remove();
	                            pics.push(oReq.responseText);
	                            for (var i=0, tf; tf=$scope.filesList[i]; i++) {
	                                if (tf.index == file.index) {
	                                    $scope.filesList.splice(i, 1);
	                                    jQuery('#uploadList_' + file.index).remove();
	                                    break;
	                                }
	                            }
	                            if (!$scope.filesList.length) {
	                                //全部完毕之后
	                                //=====================================
	                                $http.post('api/bug/add', {
	                                    width: document.documentElement.clientWidth,
	                                    height: document.documentElement.clientHeight,
	                                    dpr: window.devicePixelRatio,
	                                    ua: navigator.userAgent,
	                                    pics: pics,

	                                    ptit: $scope.bugPageTit,
	                                    purl: $scope.bugPageUrl,

	                                    business: $scope.bugBusiness || '',
	                                    description: $scope.bugDesc || ''
	                                }).success(function(data) {
	                                    $scope.showSubmiting = false;
	                                    $scope.bugid = data;
	                                    $scope.isSubmitSucc = true;
	                                });
	                            }
	                        } else {
	                            jQuery('#uploadProgress_' + file.index).html('上传失败！');
	                            jQuery('#uploadImage_' + file.index).css('opacity', 0.2);
	                        }
	                    }
	                };
	    
	                formData.append('pic', file);
	                // 开始上传
	                oReq.open('POST', 'api/upload', true);
	                oReq.send(formData);
	            }
	        }

	        if($scope.filesList.length>0) {
	            for (var i=0, file; file=$scope.filesList[i]; i++) {
	                upload(file);
	            }
	        } else {
	            $http.post('api/bug/add', {
	                width: document.documentElement.clientWidth,
	                height: document.documentElement.clientHeight,
	                dpr: window.devicePixelRatio,
	                ua: navigator.userAgent,
	                pics: pics,

	                ptit: $scope.bugPageTit,
	                purl: $scope.bugPageUrl,

	                description: $scope.bugDesc || ''
	            }).success(function(data) {
	                jQuery('.submiting').css('display', 'none');
	                $scope.bugid = data;
	                $scope.isSubmitSucc = true;
	            });
	        }
	        // var fd = new FormData(),
	        //     data = {
	        //         width: document.documentElement.clientWidth,
	        //         height: document.documentElement.clientHeight,
	        //         dpr: window.devicePixelRatio,
	        //         ua: navigator.userAgent,
	        //         pics: pics,

	        //         ptit: title,
	        //         purl: url,

	        //         description: $scope.bugDesc || '',
	        //         files: $scope.files
	        //     };
	        // angular.forEach(data, function(val, key) {
	        //     fd.append(key, val);
	        // })
	        // $http({
	        //     method: 'POST',
	        //     url: 'api/bug/add',
	        //     headers: {'Content-Type': undefined},
	        //     arrayKey: '',
	        //     data: fd,
	        //     transformRequest: angular.identity
	        // }).success(function() {

	        // })
	    }
    }
}