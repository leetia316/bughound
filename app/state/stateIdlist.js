var stateIdlist = {
  url: '/idlist',
  templateUrl: 'view/idlist.html',
  controller: function ($rootScope, $scope, $http) {
   	$http.get('api/user/list').success(function (data) {
   		$scope.userList = data
   		$scope.isLoaded = true
      console.info('用户数据', data)
   	})

   	$scope.update = function (idx, uid, name, email) {
   		$http.post('api/user/update', {
   			uid: uid,
   			name: name,
        email: email
   		}).success(function () {
        _POP_.toast('修改成功')
   			$scope.userList[idx].isEditing = false
   		})
   	}
   	$scope.del = function (idx, uid) {
   		$rootScope.modConfirmTit = '警告'
   		$rootScope.modConfirmCont = '你确定要删除该用户吗？'
   		$rootScope.isPopupModConfirm = true
   		$rootScope.modConfirmCancel = function () {
   			$rootScope.isPopupModConfirm = false
   		}
   		$rootScope.modConfirmConfirm = function () {
   			$http.post('api/user/del', {
     			uid: uid
     		}).success(function () {
     			_POP_.toast('删除成功')
     			$rootScope.isPopupModConfirm = false
     			$scope.userList.splice(idx, 1)
     		})
   		}
   	}
   	$scope.add = function () {
   		$http.post('api/user/add', {
   			erp: $scope.newErp,
   			name: $scope.newName,
        email: $scope.newEmail
   		}).success(function (data) {
   			$scope.isAdding = false
   			$scope.newErp = null
   			$scope.newName = null
   			$scope.userList.push(data)
        _POP_.toast('添加成功')
   		})
   	}
  }
}
