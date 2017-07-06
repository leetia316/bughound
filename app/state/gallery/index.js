var style = require('./style.scss')
var template = require('./template.html')

var stateList = {
  url: '/list',
  template: template,
  controller: function ($rootScope, $scope, $http, $state, Session) {
  	var preSelectBugState

  	$scope.stateNames = ['未解决', '已解决', '已关闭']

  	$scope.Session = Session
  	$scope.selectBugState = ''
  	$scope.subsbustr = ''
  	$scope.currentPage = 1
	  $scope.itemsPerPage = 15
	  $scope.isMine = false

		// 业务列表
		$http.get('api/sbu/list').then(function (res) {
			$scope.sbus = res.data
		})

	  var demandsChange = function (opts) {
			$http.post('api/demand/listpart', opts).then(function (res) {
        if (res.status !== 200) {
          return
        }
        var data = res.data
  	    var result
  	    var demands = data.demands
  	    if (data.count) {
  	    	// 重置页数
  	    	$scope.currentPage = 1
  	    	$scope.totalcount = data.count
  	    }
  	    console.info('需求数据', demands, data.count)
  	    for (var i = 0; i < demands.length; i++) {
	        result = new UAParser().setUA(demands[i].env.ua).getResult()
	        demands[i].device = result.device.model || ''
	        demands[i].files = demands[i].files || []

	        // 文件计数
	        var tcount = demands[i].files && demands[i].files.length ? demands[i].files.length : 0
	        if (demands[i].news && demands[i].news.length) {
	        	var tnews = demands[i].news
	        	for (var j = 0; j < tnews.length; j++) {
	        		if (tnews[j].files && tnews[j].files.length) {
	        			tcount += tnews[j].files.length
	        		}
	        	}
	        }
	        demands[i].filescount = tcount
  	    }
  	    $scope.isLoaded = true
  	    $scope.bugList = $scope.predlist = demands || []
    	})
	  }
	  //-----页面刚进来啊-----
	  // demandsChange({
    //      		// states: [0],
    //      		// sbu: '',
    //      		// skip: 0,
    //      		limit: $scope.itemsPerPage,
    //      		count: true,
    //      		// mine: false
    //      	})

	  //-----选择业务-----
    $scope.selectedObject = function (selectedSbu) {
    	if (selectedSbu) {
    		$scope.oDemandsList = $scope.bugList
    		console.info('选择业务', selectedSbu)
    		$scope.selectedSbu = selectedSbu.originalObject
	    	demandsChange({
	    		states: $scope.selectBugState !== '' ? [$scope.selectBugState] : [],
     			sbu: $scope.selectedSbu._id,
     			limit: $scope.itemsPerPage,
     			count: true,
     			mine: $scope.isMine
     		})
    	} else {
    		// 最好不用请求还原数据，又担心在清空业务输入框前，其他变量产生了变化
    		$scope.bugList = $scope.oDemandsList
    	}
    }
    //-----选择我的需求吗-----
    $scope.selectMineDemand = function (isMine) {
    	$scope.isMine = !!isMine
    	demandsChange({
	    	states: $scope.selectBugState !== '' ? [$scope.selectBugState] : [],
     		sbu: $scope.selectedSbu ? $scope.selectedSbu._id : '',
     		limit: $scope.itemsPerPage,
     		count: true,
     		mine: $scope.isMine
     	})
    }
    //-----翻页-----
    $scope.selectPage = function (pagenumber, $event) {
    	demandsChange({
	    	states: $scope.selectBugState !== '' ? [$scope.selectBugState] : [],
     		sbu: $scope.selectedSbu ? $scope.selectedSbu._id : '',
     		skip: ($scope.currentPage - 1) * $scope.itemsPerPage,
     		limit: $scope.itemsPerPage,
     		mine: $scope.isMine
     	})
    }

    $scope.$watch('selectBugId', function (n, o, scope) {
    	if (n && !o) {
    		preSelectBugState = scope.selectBugState
    		scope.selectBugState = ''
    	} else if (!n && o) {
    		scope.selectBugState = preSelectBugState
    	}
    })
    $scope.$watch('selectBugState', function (n, o, scope) {
    	//-----选择状态在这里-----
    	demandsChange({
	    	states: $scope.selectBugState !== '' ? [$scope.selectBugState] : null,
     		sbu: $scope.selectedSbu ? $scope.selectedSbu._id : '',
     		skip: ($scope.currentPage - 1) * $scope.itemsPerPage,
     		limit: $scope.itemsPerPage,
     		count: true,
     		mine: $scope.isMine
     	})
    })
  }
}

module.exports = stateList
