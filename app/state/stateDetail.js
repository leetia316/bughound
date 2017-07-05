var stateDetail = {
  url: '/detail/:id',
  templateUrl: 'view/detail.html',
  controller: function ($rootScope, $scope, $http, $state, $stateParams, Session, FileUploader) {
    var stateNames = ['未完成', '已完成', '已关闭']

    $scope.Session = Session

    // 业务列表
    $http.get('api/sbu/list').success(function (data) {
      $scope.sbus = data
    })

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
    // 全部上传后
    $scope.uploader.onCompleteAll  = function () {
      var uploadedList = []
      angular.forEach($scope.uploader.queue, function (v, k) {
        if (v.isSuccess) {
          // console.log(v)
          uploadedList.push({name: v.remoteName, oname: v.file.name, size: v.file.size, type: v.file.type})
        }
      })

      $http.post('api/demand/news_upload', {
        did: $scope.data._id,
        files: uploadedList
      }).success(function (news) {
        // 还是要处理一下下的
        news.user = {}
        news.user.name = Session.userName

        $scope.data.news.push(news)
        _POP_.toast('文件已上传')
        $scope.isShowFornowmenu = $scope.whatNowhandling = null
        $scope.uploader.clearQueue()
      })
    }

  	$http.get('api/demand/get', {
  		params: {
  			did: $stateParams.id
  		}
  	}).success(function (data) {
  		data.pics = data.pics || []
  		data.ua = new UAParser().setUA(data.env.ua).getResult()

      // 文件计数
      var totalFiles = data.files && data.files.length ? data.files : []
      if (data.news && data.news.length) {
        var tnews = data.news
        for (var j = 0; j < tnews.length; j++) {
          if (tnews[j].files && tnews[j].files.length) {
            totalFiles = totalFiles.concat(tnews[j].files)
          }
        }
      }
      data.totalFiles = totalFiles

  		$scope.data = data
      console.info('需求数据', data)
  	})


    $scope.nowcommentfn = function () {
      var html = jQuery('#editor').froalaEditor('html.get')
      if (!html) {
        _POP_.toast('你好像没有写什么')
        return
      }

      $http.post('api/demand/news_comment', {
        did: $scope.data._id,
        comment: html
      }).success(function (news) {
        _POP_.toast('评论成功')

        // 还是要处理一下下的
        news.user = {}
        news.user.name = Session.userName

        $scope.data.news.push(news)
        $scope.isShowFornowmenu = $scope.whatNowhandling = null

        // 净空编辑器
        jQuery('#editor').froalaEditor('html.set', '')
      })
    }
    $scope.nowhandlefn = function (state) {
      var nowstate = $scope.data.state

      if (state === nowstate || (state !== 0 && state !== 1)) {
        return
      }

      $http.post('api/demand/news_handle', {
        did: $scope.data._id,
        handle: state
      }).success(function (news) {
        if (state === 0) {
          _POP_.toast('需求已驳回')
        } else if (state === 1) {
          _POP_.toast('需求已完成')
        }
        $scope.data.state = state

        // 还是要处理一下下的
        news.user = {}
        news.user.name = Session.userName

        $scope.data.news.push(news)
      }).error(function () {
        _POP_.toast('未知错误')
      })
      $scope.isShowFornowmenu = $scope.whatNowhandling = null
    }

    $scope.$watch('data.state', function (n, o, scope) {
      if (scope.data) {
        scope.data.stateName = stateNames[n] || '未知状态'
      }
    })

    jQuery(function () {
      jQuery('#editor').froalaEditor({
        toolbarButtons: ['emoticons'],
        placeholderText: '',
        toolbarBottom: true
      })
    })

    // v复用申请页的粘贴事件，略作修改：当文件上传处为隐藏时不做任何事
    document.addEventListener('paste', function (event) {
      if ($scope.whatNowhandling !== 'upload') {
        return
      }
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
            if (items[i].type.indexOf('image') !== -1) {
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
