var stateIdlist = {
    url:'/idlist',
    templateUrl: 'view/idlist.html',
    controller: function($rootScope, $scope, $http) {
       	$http.get('api/user/list').success(function(data) {
       		$scope.userList = data;
       		$scope.isLoaded = true;
       	});

       	$scope.update = function(idx, erp, name) {
       		$http.post('api/user/update', {
       			erp: erp,
       			name: name
       		}).success(function() {
       			console.log('success');
       			$scope.userList[idx].isEditing = false;
       		});
       	}
       	$scope.del = function(idx, erp) {
       		$rootScope.modConfirmTit = '警告';
       		$rootScope.modConfirmCont = '你确定要删除该用户吗？';
       		$rootScope.isPopupModConfirm = true;
       		$rootScope.modConfirmCancel = function() {
       			$rootScope.isPopupModConfirm = false;
       		}
       		$rootScope.modConfirmConfirm = function() {
       			$http.post('api/user/del', {
	       			erp: erp
	       		}).success(function() {
	       			console.log('success');
	       			$rootScope.isPopupModConfirm = false;
	       			$scope.userList.splice(idx, 1);
	       		});
       		}
       	}
       	$scope.add = function() {
       		$http.post('api/user/add', {
       			erp: $scope.newErp,
       			name: $scope.newName,
                email: $scope.newEmail
       		}).success(function(data) {
       			$scope.isAdding = false;
       			$scope.newErp = null;
       			$scope.newName = null;
       			$scope.userList.push(data);
       		});
       	}
    }
}