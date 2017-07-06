var style = require('./style.scss')
var template = require('./template.html')

var stateApply = {
  url: '/apply',
  template: template,
  controller: function ($rootScope, $scope, $http, FileUploader) {
    var gIdx = 0
		var files = []

  	// 业务列表
  	$http.get('api/sbu/list').then(function (res) {
      var data = res.data
  		$scope.sbus = data
  	})

  	// 选择业务
  	$scope.selectItem = function (id, name) {
  		console.info('选择业务id', id)
  		$scope.d_sbuname = name
  		$scope.d_sbu = id
  		$scope.isdropdownactive = false
  	}

  	// 添加业务
  	$scope.addSbu = function (name) {
  		$scope.d_sbuname = name
  		$scope.d_sbu = null
  		$scope.isdropdownactive=false
  	}

  	// 文件上传器
    $scope.uploader = new FileUploader({
    	url: 'api/upload'
  	})

    // 每个文件上传成功后记录在远程存储的文件名
  	$scope.uploader.onSuccessItem  = function (item, res, status, headers) {
  		if (status === 200) {
        item.remoteName = res
      }
  	}

    $scope.submit = function () {
    	if (!$scope.d_title) {
        _POP_.toast('需求名称不能为空')
        return
      }
    	// if (!$scope.d_sbu && !jQuery('#sbu_value').val()) { _POP_.toast('所属业务不能为空') return }
    	if (!$scope.d_sbu && !$scope.d_sbuname) {
        _POP_.toast('所属业务不能为空')
        return
      }

    	var uploadedList = []
      angular.forEach($scope.uploader.queue, function (v, k) {
      	v.isSuccess && uploadedList.push({name: v.remoteName, oname: v.file.name, size: v.file.size, type: v.file.type})
      })

  		$http.post('api/demand/add', {
  			title: $scope.d_title,
  			sbu: $scope.d_sbu || null,
  			sbustr: $scope.d_sbuname,
  			desc: jQuery('#editor').froalaEditor('html.get'),
  			files: uploadedList,

  			// ENV
		    width: document.documentElement.clientWidth,
		    height: document.documentElement.clientHeight,
		    dpr: window.devicePixelRatio,
		    ua: navigator.userAgent
  		}).then(function (res) {
        var data = res.data
  			console.info('新需求ID', data)
		    $scope.bugid = data
		    $scope.isSubmitSucc = true
  		}).catch(function (res) {
  			if (res.status === 404) {
  				_POP_.toast('申请失败')
  			}
  		})
    }

    jQuery(function () {
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
  		})
  	})

  	document.addEventListener('paste', function (event) {
	    // console.log(event)
	    var isChrome = false
	    if (event.clipboardData || event.originalEvent) {
        //not for ie11   某些chrome版本使用的是event.originalEvent
        var clipboardData = event.clipboardData || event.originalEvent.clipboardData
        if (clipboardData.items) {
          // for chrome
          var items = clipboardData.items
          var len = items.length
          var blob = null
          isChrome = true
          //items.length比较有意思，初步判断是根据mime类型来的，即有几种mime类型，长度就是几（待验证）
          //如果粘贴纯文本，那么len=1，如果粘贴网页图片，len=2, items[0].type = 'text/plain', items[1].type = 'image/*'
          //如果使用截图工具粘贴图片，len=1, items[0].type = 'image/png'
          //如果粘贴纯文本+HTML，len=2, items[0].type = 'text/plain', items[1].type = 'text/html'
          // console.log('len:' + len)
          // console.log(items[0])
          // console.log(items[1])
          // console.log('items[0] kind:', items[0].kind)
          // console.log('items[0] MIME type:', items[0].type)
          // console.log('items[1] kind:', items[1].kind)
          // console.log('items[1] MIME type:', items[1].type)

          //阻止默认行为即不让剪贴板内容在div中显示出来
          event.preventDefault()

          //在items里找粘贴的image,据上面分析,需要循环
          for (var i = 0; i < len; i++) {
            if (items[i].type.indexOf('image') >= 0) {
              // console.log(items[i])
              // console.log(typeof (items[i]))

              //getAsFile()  此方法只是living standard  firefox ie11 并不支持
              blob = items[i].getAsFile()
              blob.name = '截图文件' + new Date().getTime() + '.png'
            }
          }
          // uploadImgFromPaste(blob, 'paste', isChrome)
          $scope.uploader.addToQueue(blob)
        } else {
        	event.preventDefault()
  		    //for firefox
  		    setTimeout(function () {
		        //设置setTimeout的原因是为了保证图片先插入到div里，然后去获取值
		        var imgList = document.querySelectorAll('.uploader_drop img')
            var len = imgList.length
		        var src_str = ''
		        var i
		        for (i = 0; i < len; i++) {
	            if (imgList[i].className !== 'my_img') {
                //如果是截图那么src_str就是base64 如果是复制的其他网页图片那么src_str就是此图片在别人服务器的地址
                src_str = imgList[i].src
	            }
		        }
		        // uploadImgFromPaste(src_str, 'paste', isChrome)
		        var b64 = src_str.replace(/^data:image\/png;base64,/, '')
		        var binary = window.atob(b64)
		        var length = binary.length
		        var buffer = new ArrayBuffer(length)
		        var view = new Uint8Array(buffer)
		        for (var i = 0; i < length; i++) {
		        	view[i] = binary.charCodeAt(i)
		        }
		        var blob = new Blob([view], {type: 'image/png'})
		        blob.name = '截图文件' + new Date().getTime() + '.png'
		        $scope.uploader.addToQueue(blob)
  		    }, 1)
    		}
	    } else {
	    	event.preventDefault()
	    	//for ie11
    		setTimeout(function () {
  		    //设置setTimeout的原因是为了保证图片先插入到div里，然后去获取值
  		    var imgList = document.querySelectorAll('.uploader_drop img')
  		    var len = imgList.length
  		    var src_str = ''
  		    var i
  		    for (i = 0; i < len; i++) {
		        if (imgList[i].className !== 'my_img') {
	            //如果是截图那么src_str就是base64 如果是复制的其他网页图片那么src_str就是此图片在别人服务器的地址
	            src_str = imgList[i].src
		        }
  		    }
  		    // uploadImgFromPaste(src_str, 'paste', isChrome)
  		    var b64 = src_str.replace(/^data:image\/png;base64,/, '')
  		    var binary = window.atob(b64)
  		    var length = binary.length
  		    var buffer = new ArrayBuffer(length)
  		    var view = new Uint8Array(buffer)
  		    for (var i = 0; i < length; i++) {
  		    	view[i] = binary.charCodeAt(i)
  		    }
  		    var blob = new Blob([view], {type: 'image/png'})
  		    blob.name = '截图文件' + new Date().getTime() + '.png'
  		    $scope.uploader.addToQueue(blob)
    		}, 1)
	    }
  	})
  }
}

module.exports = stateApply
